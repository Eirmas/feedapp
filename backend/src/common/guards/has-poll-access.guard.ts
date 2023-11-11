import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { PollService } from '../../app/poll/poll.service';
import appConfig from '../config/app-conf';
import ResourceNotFoundException from '../exceptions/resource-not-found.exception';
import { AccessTokenData } from '../interfaces/access-token.type';
import { AuthGuard } from './auth.guard';

@Injectable()
export class HasPollAccessGuard implements CanActivate {
  constructor(private pollService: PollService, private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pollId: string | undefined = request.params?.pollId;
    let user: AccessTokenData | undefined = context.switchToHttp().getRequest()?.user;

    if (!pollId) {
      throw new BadRequestException('No poll id provided');
    }

    try {
      const poll = await lastValueFrom(this.pollService.getPollById(pollId));

      if (!poll.private) {
        return true;
      }
      if (!user) {
        const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
        user = await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret);
      }

      if (poll.invites.find(invite => invite.email === user.email)) {
        return true;
      }

      if (poll.ownerId === user.sub) {
        return true;
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        throw new ForbiddenException();
      }

      throw err;
    }

    throw new ForbiddenException();
  }
}
