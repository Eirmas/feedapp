import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/app-conf';
import { AccessTokenData } from '../interfaces/access-token.type';
import { AuthGuard } from './auth.guard';

@Injectable()
export class IsDeviceGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken: AccessTokenData | undefined = context.switchToHttp().getRequest()?.user;

    if (!accessToken) {
      const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
      accessToken = await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret);
    }

    if (!accessToken.isDevice) {
      throw new ForbiddenException();
    }

    return true;
  }
}
