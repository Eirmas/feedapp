import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PollService } from '../../app/poll/poll.service';
import { UserService } from '../../app/user/user.service';
import { lastValueFrom } from 'rxjs';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth.guard';
import { InviteEntity } from '../../models';

@Injectable()
export class HasPollAccessGuard implements CanActivate {
  constructor(
    private pollService: PollService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pollId: string | undefined = request.params?.pollId;
    let userId: string = context.switchToHttp().getRequest()?.user?.sub;
    let foundInvite: InviteEntity | null = null;

    if (!pollId) {
      throw new BadRequestException('No poll id provided');
    }

    try {
      const poll = await lastValueFrom(this.pollService.getPollById(pollId));

      if (!poll.private) {
        return true;
      }

      if (!userId) {
        const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
        userId = (await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret)).sub;
      }

      if (!userId) {
        throw new UnauthorizedException();
      }

      if (poll.ownerId === userId) {
        return true;
      }

      const user = await lastValueFrom(this.userService.getUserById(userId));
      foundInvite = poll.invites.find(invite => invite.email === user.email);
    } catch {
      throw new UnauthorizedException();
    }

    if (!foundInvite) {
      throw new ForbiddenException();
    }

    return true;
  }
}
