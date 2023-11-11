import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { PollEntity } from '../../models';
import { Analytic } from '../../models/analytic.schema';
import { PollStatus } from '../../models/poll.entity';
import { AnalyticService } from '../analytic/analytic.service';
import { RmqService } from '../rmq/rmq.service';
import { VoteService } from '../vote/vote.service';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollService } from './poll.service';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';

describe('PollService', () => {
  let pollService: PollService;
  const pollRepository: MockProxy<Repository<PollEntity>> = mock<Repository<PollEntity>>();
  const voteService: MockProxy<VoteService> = mock<VoteService>();
  const analyticService: MockProxy<AnalyticService> = mock<AnalyticService>();
  const rmqService: MockProxy<RmqService> = mock<RmqService>();
  const httpService: MockProxy<HttpService> = mock<HttpService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: getRepositoryToken(PollEntity), useValue: pollRepository },
        { provide: VoteService, useValue: voteService },
        { provide: AnalyticService, useValue: analyticService },
        { provide: RmqService, useValue: rmqService },
        { provide: HttpService, useValue: httpService },
        PollService,
      ],
    }).compile();

    pollService = module.get<PollService>(PollService);
  });

  afterEach(() => {
    mockClear(pollRepository);
    mockClear(voteService);
    mockClear(analyticService);
    mockClear(rmqService);
    mockClear(httpService);
  });

  it('should be defined', async () => {
    expect(pollService).toBeDefined();
    expect(pollRepository).toBeDefined();
    expect(voteService).toBeDefined();
    expect(analyticService).toBeDefined();
    expect(rmqService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('createPoll', () => {
    it('should return poll', done => {
      const poll = {
        title: 'Title',
        question: 'Question',
        private: false,
        invites: [],
        ownerId: 'owner-id',
      } as PollEntity;

      pollRepository.save.mockResolvedValue(poll);
      pollRepository.create.mockReturnValue(poll);
      pollRepository.findOneBy.mockResolvedValue(poll);

      pollService.createPoll(poll.ownerId, { title: 'Title', question: 'Question', private: false }).subscribe(response => {
        expect(response).toBe(poll);
        expect(pollRepository.create).toBeCalledWith(poll);
        expect(pollRepository.save).toBeCalledWith(poll);
        done();
      });
    });
  });

  describe('getPollById', () => {
    it('should return poll', done => {
      const poll = {} as PollEntity;
      pollRepository.findOneBy.mockResolvedValue(poll);

      pollService.getPollById('123').subscribe(response => {
        expect(response).toBe(poll);
        expect(pollRepository.findOneBy).toBeCalledWith({ id: '123' });
        done();
      });
    });

    it('should throw error if poll does not exist', done => {
      const id = '123';
      pollRepository.findOneBy.mockResolvedValue(null);

      pollService.getPollById(id).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe(`Poll with id ${id} not found`);
          done();
        },
      });
    });
  });

  describe('updatePoll', () => {
    it('should return poll', done => {
      const results = {} as UpdateResult;
      const body = { title: 'Title', question: 'Question' } as UpdatePollDto;
      pollRepository.update.mockResolvedValue(results);

      pollService.updatePoll('123', body).subscribe(response => {
        expect(response).toBe(results);
        expect(pollRepository.update).toBeCalledWith({ id: '123' }, body);
        done();
      });
    });

    it('should throw error if poll does not exist', done => {
      const id = '123';
      const body = { title: 'Title', question: 'Question' } as UpdatePollDto;
      pollRepository.update.mockResolvedValue({ affected: 0 } as UpdateResult);

      pollService.updatePoll(id, body).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe(`Poll with id ${id} not found`);
          done();
        },
      });
    });
  });

  describe('closePoll', () => {
    it('should close the poll', done => {
      const poll = { id: '123', status: PollStatus.OPEN } as PollEntity;
      const results = { affected: 1 } as UpdateResult;
      pollRepository.findOneBy.mockResolvedValue(poll);
      pollRepository.update.mockResolvedValue(results);
      httpService.post.mockReturnValue(of({} as AxiosResponse<Analytic>));
      rmqService.closePoll.mockReturnValue(of(undefined));
      voteService.getVotesByPoll.mockReturnValue(of({ yes: 1, no: 1 }));
      analyticService.createAnalytic.mockReturnValue(of({} as Analytic));

      pollService.closePoll(poll.id).subscribe(response => {
        expect(response).toBe(results);
        expect(pollRepository.findOneBy).toBeCalledWith({ id: poll.id });
        expect(pollRepository.update).toBeCalledWith({ id: poll.id }, { status: PollStatus.CLOSED });
        done();
      });
    });

    it('should throw error if poll does not exist', done => {
      const poll = { id: '123', status: PollStatus.OPEN } as PollEntity;
      const results = { affected: 0 } as UpdateResult;
      pollRepository.findOneBy.mockResolvedValue(poll);
      pollRepository.update.mockResolvedValue(results);

      pollService.closePoll(poll.id).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe(`Poll with id ${poll.id} not found`);
          done();
        },
      });
    });

    it('should throw error if poll is already closed', done => {
      const poll = { id: '123', status: PollStatus.CLOSED } as PollEntity;
      pollRepository.findOneBy.mockResolvedValue(poll);

      pollService.closePoll(poll.id).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceClosedException);
          expect(error.message).toBe(`Poll with id ${poll.id} is already closed`);
          done();
        },
      });
    });
  });

  describe('deletePoll', () => {
    it('should return delete result', done => {
      const results = { affected: 1 } as UpdateResult;
      pollRepository.delete.mockResolvedValue(results);

      pollService.deletePoll('123').subscribe(response => {
        expect(response).toBe(results);
        expect(pollRepository.delete).toBeCalledWith({ id: '123' });
        done();
      });
    });

    it('should throw error if poll does not exist', done => {
      const id = '123';
      pollRepository.delete.mockResolvedValue({ affected: 0 } as UpdateResult);

      pollService.deletePoll(id).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe(`Poll with id ${id} not found`);
          done();
        },
      });
    });
  });

  describe('dweetAnalytic', () => {
    it('should send analytic to dweet.io', done => {
      const analytic = { _id: '123' } as Analytic;
      httpService.post.mockReturnValue(of({} as AxiosResponse));

      pollService['dweetAnalytic'](analytic).subscribe(response => {
        expect(response).toBe(analytic);
        expect(httpService.post).toBeCalledWith(`https://dweet.io/dweet/for/${analytic._id}`, analytic);
        done();
      });
    });
  });
});
