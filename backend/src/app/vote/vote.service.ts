import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, of, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { VoteEntity } from '../../models';
import { supabase } from '../../common/supabase';
import { AggregatedVotes } from './vote.controller';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly voteRepository: Repository<VoteEntity>,
  ) {}

  public getVotesByPoll(pollId: string): Observable<AggregatedVotes> {
    return combineLatest([
      from(this.voteRepository.count({ where: { pollId, answer: true } })),
      from(this.voteRepository.count({ where: { pollId, answer: false } })),
    ]).pipe(switchMap(([yes, no]) => of({ yes, no })));
  }

  public createVote(pollId: string, answer: boolean): Observable<VoteEntity> {
    return from(supabase.from('votes').insert({ pollId, answer }).select()).pipe(
      switchMap(res => {
        if (res.error) {
          return throwError(() => new Error(res.error.message));
        }

        return of(res.data[0] as VoteEntity);
      }),
    );
  }
}
