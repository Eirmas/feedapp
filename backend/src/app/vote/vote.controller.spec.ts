import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { VoteEntity } from '../../models';
import { PollService } from '../poll/poll.service';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

describe('VoteController', () => {
  let voteController: VoteController;
  const voteService: MockProxy<VoteService> = mock<VoteService>();
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const pollService: MockProxy<JwtService> = mock<JwtService>();
  const configService: MockProxy<ConfigService> = mock<ConfigService>();

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        { provide: VoteService, useValue: voteService },
        { provide: JwtService, useValue: jwtService },
        { provide: PollService, useValue: pollService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    voteController = app.get<VoteController>(VoteController);
  });

  afterEach(() => {
    mockClear(voteService);
  });

  it('should be defined', async () => {
    expect(voteController).toBeDefined();
    expect(voteService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(pollService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('GET Votes by Poll', () => {
    it('should return votes', done => {
      const votes = { yes: 1, no: 1 };
      voteService.getVotesByPoll.mockReturnValue(of(votes));

      voteController.getVotesByPoll('poll-id').then(response => {
        expect(response).toBe(votes);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      voteService.getVotesByPoll.mockReturnValue(throwError(() => new Error('error')));

      voteController.getVotesByPoll('poll-id').catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if poll is not found', done => {
      voteService.getVotesByPoll.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      voteController.getVotesByPoll('poll-id').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('POST Create Vote', () => {
    it('should create a vote', done => {
      const vote = {} as VoteEntity;
      voteService.createVote.mockReturnValue(of(vote));

      voteController.createVote('123', { answer: true }).then(response => {
        expect(response).toBe(vote);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      voteService.createVote.mockReturnValue(throwError(() => new Error('error')));

      voteController.createVote('123', { answer: true }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw a not found error if poll is not found', done => {
      voteService.createVote.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      voteController.createVote('123', { answer: true }).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });

    it('should throw an error if the poll is closed', done => {
      voteService.createVote.mockReturnValue(throwError(() => new ResourceClosedException('error')));

      voteController.createVote('123', { answer: true }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        expect(error).toBeDefined();
        done();
      });
    });
  });
});
