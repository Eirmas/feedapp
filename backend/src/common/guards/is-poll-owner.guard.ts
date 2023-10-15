import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PollService } from '../../app/poll/poll.service';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from './auth.guard';
import appConfig from '../config/app-conf';
import { PollEntity } from '../../models';
import ResourceNotFoundException from '../exceptions/resource-not-found.exception';

@Injectable()
export class IsPollOwnerGuard implements CanActivate {
  constructor(private pollService: PollService, private configService: ConfigService, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pollId: string | undefined = request.params?.pollId;
    let userId: string = context.switchToHttp().getRequest()?.user?.sub;
    let poll: PollEntity | null = null;

    if (!pollId) {
      throw new BadRequestException('No poll id provided');
    }

    try {
      poll = await lastValueFrom(this.pollService.getPollById(pollId));
    } catch (err) {
      throw new ForbiddenException();
    }

    if (!userId) {
      const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
      userId = (await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret)).sub;
    }

    if (poll.ownerId !== userId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
