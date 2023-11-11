import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { supabase } from '../../common/supabase';
import { VoteEntity } from '../../models';
import { VoteService } from './vote.service';

describe('VoteService', () => {
  let voteService: VoteService;
  const voteRepository: MockProxy<Repository<VoteEntity>> = mock<Repository<VoteEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: getRepositoryToken(VoteEntity), useValue: voteRepository }, VoteService],
    }).compile();

    voteService = module.get<VoteService>(VoteService);
  });

  afterEach(() => {
    mockClear(voteRepository);
  });

  it('should be defined', async () => {
    expect(voteService).toBeDefined();
    expect(voteRepository).toBeDefined();
  });

  describe('getVotesByPoll', () => {
    it('should return an aggregated set of votes by poll', done => {
      const pollId = '123';
      voteRepository.count.mockResolvedValue(1);

      voteService.getVotesByPoll(pollId).subscribe(result => {
        expect(result).toStrictEqual({ yes: 1, no: 1 });
        expect(voteRepository.count).toHaveBeenCalledTimes(2);
        expect(voteRepository.count).toHaveBeenCalledWith({ where: { pollId, answer: true } });
        expect(voteRepository.count).toHaveBeenCalledWith({ where: { pollId, answer: false } });
        done();
      });
    });
  });

  describe('createVote', () => {
    const vote = { id: '123', answer: true } as VoteEntity;

    it('should return a vote', done => {
      const select = jest.fn(() => Promise.resolve({ data: [vote] }));
      const insert = jest.fn().mockReturnValue({ select });
      const from = jest.fn().mockReturnValue({ insert });

      jest.spyOn(supabase, 'from').mockImplementation(from);

      voteService.createVote(vote.id, vote.answer).subscribe(result => {
        expect(result).toBe(vote);
        expect(from).toBeCalledWith('votes');
        expect(insert).toBeCalledWith({ pollId: vote.id, answer: vote.answer });
        done();
      });
    });

    it('should throw an error if there was an error', done => {
      const select = jest.fn(() => Promise.reject(new Error('error')));
      const insert = jest.fn().mockReturnValue({ select });
      const from = jest.fn().mockReturnValue({ insert });

      jest.spyOn(supabase, 'from').mockImplementation(from);

      voteService.createVote(vote.id, vote.answer).subscribe({
        error: err => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('error');
          expect(from).toBeCalledWith('votes');
          expect(insert).toBeCalledWith({ pollId: vote.id, answer: vote.answer });
          done();
        },
      });
    });
  });
});
