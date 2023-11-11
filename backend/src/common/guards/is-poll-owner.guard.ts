import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { PollService } from '../../app/poll/poll.service';
import { PollEntity } from '../../models';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth.guard';
import { AccessTokenData } from '../interfaces/access-token.type';

@Injectable()
export class IsPollOwnerGuard implements CanActivate {
  constructor(private pollService: PollService, private configService: ConfigService, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pollId: string | undefined = request.params?.pollId;
    let user: AccessTokenData | undefined = context.switchToHttp().getRequest()?.user;
    let poll: PollEntity | null = null;

    if (!pollId) {
      throw new BadRequestException('No poll id provided');
    }

    try {
      poll = await lastValueFrom(this.pollService.getPollById(pollId));
    } catch (err) {
      throw new ForbiddenException();
    }

    if (!user) {
      const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
      user = await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret);
    }

    if (poll.ownerId !== user.sub) {
      throw new ForbiddenException();
    }

    return true;
  }
}
