import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../config/app-conf';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AccessTokenData } from '../interfaces/access-token.type';

interface IRequest {
  headers: {
    authorization?: string;
  };
  user?: AccessTokenData;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
    const request = context.switchToHttp().getRequest<IRequest>();
    request.user = await AuthGuard.getUserFromRequest(request, this.jwtService, config.jwt.secret);
    return true;
  }

  public static async getUserFromRequest(request: IRequest, jwtService: JwtService, secret: string): Promise<AccessTokenData> {
    const [type, jwt] = request.headers.authorization?.split(' ') ?? [];
    const token = type === 'Bearer' ? jwt : undefined;

    if (!token) {
      throw new UnauthorizedException('No token in header');
    }

    try {
      return await jwtService.verifyAsync<AccessTokenData>(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
