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
import { HasPollAccessGuard } from './has-poll-access.guard';

describe('HasPollAccessGuard', () => {
  let hasPollAccessGuard: HasPollAccessGuard;
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
      providers: [HasPollAccessGuard, { provide: JwtService, useValue: jwtService }, { provide: PollService, useValue: pollService }],
    }).compile();

    hasPollAccessGuard = module.get<HasPollAccessGuard>(HasPollAccessGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(hasPollAccessGuard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(pollService).toBeDefined();
  });

  it('should throw an error is pollId is not set', done => {
    const context = getMockedContext();

    hasPollAccessGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('No poll id provided');
      done();
    });
  });

  it('should throw an error if poll is not found by id', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

    hasPollAccessGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(ForbiddenException);
      done();
    });
  });

  it('should throw an error if jwt token is invalid', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true } as PollEntity));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.reject(new UnauthorizedException()));

    hasPollAccessGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(UnauthorizedException);
      done();
    });
  });

  it('should pass if the poll is public', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: false } as PollEntity));

    hasPollAccessGuard.canActivate(context).then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should pass if the user has an invite to the poll', done => {
    const context = getMockedContext('123');
    const user = { email: 'email@feedapp.no', sub: '123' };
    const poll = { private: true, invites: [{ email: user.email }] } as PollEntity;
    pollService.getPollById.mockReturnValue(of(poll));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.resolve(user));

    hasPollAccessGuard.canActivate(context).then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should pass if the user is the owner of the poll without an invite and is private', done => {
    const context = getMockedContext('123');
    const user = { email: 'email@feedapp.no', sub: '123' };
    const poll = { private: true, invites: [], ownerId: user.sub } as PollEntity;
    pollService.getPollById.mockReturnValue(of(poll));
    jest.spyOn(AuthGuard, 'getUserFromRequest').mockImplementation(() => Promise.resolve(user));

    hasPollAccessGuard.canActivate(context).then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  function getMockedContext(pollId?: string): ExecutionContext {
    const request = {
      params: {
        pollId,
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
