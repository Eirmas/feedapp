import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PollService } from '../../app/poll/poll.service';
import { PollEntity } from '../../models';
import { PollStatus } from '../../models/poll.entity';

@Injectable()
export class PollIsOpenGuard implements CanActivate {
  constructor(private pollService: PollService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pollId: string | undefined = request.params?.pollId;
    let poll: PollEntity | null = null;

    if (!pollId) {
      throw new BadRequestException('No poll id provided');
    }

    try {
      poll = await lastValueFrom(this.pollService.getPollById(pollId));
    } catch (err) {
      throw new ForbiddenException();
    }

    if (poll.status === PollStatus.CLOSED) {
      throw new BadRequestException('poll_closed', 'Poll is closed');
    }

    return true;
  }
}
