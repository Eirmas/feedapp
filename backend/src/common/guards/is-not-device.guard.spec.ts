import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import appConfig from '../config/app-conf';
import { AuthGuard } from './auth.guard';
import { IsNotDeviceGuard } from './is-not-device.guard';

describe('IsNotDeviceGuard', () => {
  let isNotDeviceGuard: IsNotDeviceGuard;
  let configService: ConfigService;
  const jwtService: MockProxy<JwtService> = mock<JwtService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [IsNotDeviceGuard, { provide: JwtService, useValue: jwtService }],
    }).compile();

    isNotDeviceGuard = module.get<IsNotDeviceGuard>(IsNotDeviceGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(isNotDeviceGuard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should return true if its not a device', done => {
    const context = getMockedContext();
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.resolve({ sub: '123', email: 'email@feedapp.no' }));

    isNotDeviceGuard.canActivate(context).then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should throw error if its a device', done => {
    const context = getMockedContext();
    jest
      .spyOn(AuthGuard, 'getUserFromRequest')
      .mockImplementation(() => Promise.resolve({ sub: '123', email: 'email@feedapp.no', isDevice: true }));

    isNotDeviceGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(ForbiddenException);
      done();
    });
  });

  function getMockedContext(user?: string): ExecutionContext {
    const request = {
      user,
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return context;
  }
});
