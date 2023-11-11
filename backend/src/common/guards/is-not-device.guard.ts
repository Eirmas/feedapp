import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/app-conf';
import { AccessTokenData } from '../interfaces/access-token.type';
import { AuthGuard } from './auth.guard';

@Injectable()
export class IsNotDeviceGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken: AccessTokenData | undefined = context.switchToHttp().getRequest()?.user;

    try {
      if (!accessToken) {
        const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
        accessToken = await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret);
      }
    } catch (err) {
      return true;
    }

    if (accessToken.isDevice) {
      throw new ForbiddenException("Devices don't have access to this resource");
    }

    return true;
  }
}
