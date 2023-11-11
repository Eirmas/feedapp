import { BadRequestException, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { PollService } from '../../app/poll/poll.service';
import { PollEntity } from '../../models';
import appConfig from '../config/app-conf';
import ResourceNotFoundException from '../exceptions/resource-not-found.exception';
import { AuthGuard } from './auth.guard';
import { IsPollOwnerGuard } from './is-poll-owner.guard';

describe('IsPollOwnerGuard', () => {
  let isPollOwnerGuard: IsPollOwnerGuard;
  let configService: ConfigService;
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const pollService: MockProxy<PollService> = mock<PollService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [IsPollOwnerGuard, { provide: JwtService, useValue: jwtService }, { provide: PollService, useValue: pollService }],
    }).compile();

    isPollOwnerGuard = module.get<IsPollOwnerGuard>(IsPollOwnerGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(isPollOwnerGuard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(pollService).toBeDefined();
  });

  it('should throw an error is pollId is not set', done => {
    const context = getMockedContext();

    isPollOwnerGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('No poll id provided');
      done();
    });
  });

  it('should throw an error if poll is not found by id', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

    isPollOwnerGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(ForbiddenException);
      done();
    });
  });

  it('should throw an error if jwt token is invalid', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true } as PollEntity));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.reject(new UnauthorizedException()));

    isPollOwnerGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      done();
    });
  });

  it('should throw an error if user is not poll owner', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true, ownerId: '321' } as PollEntity));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.resolve({ sub: '123', email: 'email@feedapp.no' }));

    isPollOwnerGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(ForbiddenException);
      done();
    });
  });

  it('should pass if the user is poll owner', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true, ownerId: '123' } as PollEntity));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.resolve({ sub: '123', email: 'email@feedapp.no' }));

    isPollOwnerGuard.canActivate(context).then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  function getMockedContext(pollId?: string): ExecutionContext {
    const request = {
      params: {
        pollId: pollId,
      },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return context;
  }
});
