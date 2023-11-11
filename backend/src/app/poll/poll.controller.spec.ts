import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { PollEntity } from '../../models';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

describe('PollController', () => {
  let pollController: PollController;
  const pollService: MockProxy<PollService> = mock<PollService>();
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const configService: MockProxy<ConfigService> = mock<ConfigService>();
  const mockAccessToken: AccessTokenData = { sub: 'user-id', email: 'user@feedapp.no' };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [PollController],
      providers: [
        { provide: PollService, useValue: pollService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PollService, useValue: pollService },
      ],
    }).compile();

    pollController = app.get<PollController>(PollController);
  });

  afterEach(() => {
    mockClear(pollService);
  });

  it('should be defined', async () => {
    expect(pollController).toBeDefined();
    expect(pollService).toBeDefined();
  });

  describe('GET Polls', () => {
    it('should return polls', done => {
      const polls = {} as PageDto<PollEntity>;
      pollService.getPollsByUser.mockReturnValue(of(polls));

      pollController.getPolls(mockAccessToken, new PageOptionsDto()).then(response => {
        expect(response).toBe(polls);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.getPollsByUser.mockReturnValue(throwError(() => new Error('error')));

      pollController.getPolls(mockAccessToken, new PageOptionsDto()).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('GET Public Polls', () => {
    it('should return public polls', done => {
      const polls = {} as PageDto<PollEntity>;
      pollService.getPublicPolls.mockReturnValue(of(polls));

      pollController.getPublicPolls(new PageOptionsDto()).then(response => {
        expect(response).toBe(polls);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.getPublicPolls.mockReturnValue(throwError(() => new Error('error')));

      pollController.getPublicPolls(new PageOptionsDto()).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('GET Poll by id', () => {
    it('should return poll', done => {
      const poll = {} as PollEntity;
      pollService.getPollById.mockReturnValue(of(poll));

      pollController.getPollById('pollId').then(response => {
        expect(response).toBe(poll);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.getPollById.mockReturnValue(throwError(() => new Error('error')));

      pollController.getPollById('pollId').catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw not found error of there was an error', done => {
      pollService.getPollById.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      pollController.getPollById('pollId').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('POST Create Poll', () => {
    it('should create poll', done => {
      const poll = {} as PollEntity;
      pollService.createPoll.mockReturnValue(of(poll));

      pollController.createPoll(mockAccessToken, { title: 'Title', question: 'Question', private: false }).then(response => {
        expect(response).toBe(poll);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.createPoll.mockReturnValue(throwError(() => new Error('error')));

      pollController.createPoll(mockAccessToken, { title: 'Title', question: 'Question', private: false }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('PUT Close Poll', () => {
    it('should close poll', done => {
      const result = {} as UpdateResult;
      pollService.closePoll.mockReturnValue(of(result));

      pollController.closePoll('pollId').then(response => {
        expect(response).toBe(result);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.closePoll.mockReturnValue(throwError(() => new Error('error')));

      pollController.closePoll('pollId').catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw not found error of there was an error', done => {
      pollService.closePoll.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      pollController.closePoll('pollId').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('PUT Update Poll', () => {
    it('should update poll', done => {
      const result = {} as UpdateResult;
      pollService.updatePoll.mockReturnValue(of(result));

      pollController.updatePoll('pollId', { title: 'Title', question: 'Question', private: false }).then(response => {
        expect(response).toBe(result);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.updatePoll.mockReturnValue(throwError(() => new Error('error')));

      pollController.updatePoll('pollId', { title: 'Title', question: 'Question', private: false }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw not found error of the poll doesnt exist', done => {
      pollService.updatePoll.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      pollController.updatePoll('pollId', { title: 'Title', question: 'Question', private: false }).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('DELETE Poll', () => {
    it('should delete poll', done => {
      const result = {} as UpdateResult;
      pollService.deletePoll.mockReturnValue(of(result));

      pollController.deletePoll('pollId').then(response => {
        expect(response).toBe(result);
        done();
      });
    });

    it('should throw bad request error of there was an error', done => {
      pollService.deletePoll.mockReturnValue(throwError(() => new Error('error')));

      pollController.deletePoll('pollId').catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw not found error of the poll doesnt exist', done => {
      pollService.deletePoll.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      pollController.deletePoll('pollId').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });
});
