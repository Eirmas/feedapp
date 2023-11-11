import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { PollService } from '../../app/poll/poll.service';
import { PollEntity } from '../../models';
import { PollStatus } from '../../models/poll.entity';
import ResourceNotFoundException from '../exceptions/resource-not-found.exception';
import { PollIsOpenGuard } from './poll-is-open.guard';

describe('PollIsOpenGuard', () => {
  let pollIsOpenGuard: PollIsOpenGuard;
  const pollService: MockProxy<PollService> = mock<PollService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollIsOpenGuard, { provide: PollService, useValue: pollService }],
    }).compile();

    pollIsOpenGuard = module.get<PollIsOpenGuard>(PollIsOpenGuard);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pollIsOpenGuard).toBeDefined();
    expect(pollService).toBeDefined();
  });

  it('should throw an error is pollId is not set', done => {
    const context = getMockedContext();

    pollIsOpenGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('No poll id provided');
      done();
    });
  });

  it('should throw an error if poll is not found by id', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

    pollIsOpenGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      done();
    });
  });

  it('should throw an error if the poll is closed', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true, status: PollStatus.CLOSED } as PollEntity));

    pollIsOpenGuard.canActivate(context).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      done();
    });
  });

  it('should return true if the poll is open', done => {
    const context = getMockedContext('123');
    pollService.getPollById.mockReturnValue(of({ private: true, status: PollStatus.OPEN } as PollEntity));

    pollIsOpenGuard.canActivate(context).then(result => {
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
