import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PollService } from '../../app/poll/poll.service';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from './auth.guard';
import appConfig from '../config/app-conf';
import { PollEntity } from '../../models';
import ResourceNotFoundException from '../exceptions/resource-not-found.exception';
import { PollStatus } from 'backend/src/models/poll.entity';

@Injectable()
export class PollIsOpenGuard implements CanActivate {
  constructor(private pollService: PollService, private configService: ConfigService, private jwtService: JwtService) {}

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
