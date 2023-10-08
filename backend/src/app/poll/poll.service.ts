import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import { PollStatus } from 'domain-models';
import { Observable, combineLatest, from, of, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { PollEntity } from '../../models';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { VoteService } from '../vote/vote.service';
import { AnalyticService } from '../analytic/analytic.service';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollEntity)
    private readonly pollRepository: Repository<PollEntity>,
    private readonly voteService: VoteService,
    private readonly analyticService: AnalyticService,
  ) {}

  public createPoll(ownerId: string, createPollDto: CreatePollDto): Observable<PollEntity> {
    const emails = createPollDto.private ? Array.from(new Set(createPollDto.emails)) : [];

    return from(
      this.pollRepository.save(
        this.pollRepository.create({
          ...createPollDto,
          ownerId,
          invites: emails.map(email => ({ email })),
        }),
      ),
    );
  }

  public getPollsByUser(userId: string): Observable<PollEntity[]> {
    return from(this.pollRepository.find({ where: { ownerId: userId } }));
  }

  public getPollById(id: string): Observable<PollEntity | null> {
    return from(this.pollRepository.findOneBy({ id })).pipe(
      tap(poll => {
        if (!poll) {
          throw new ResourceNotFoundException(`Poll with id ${id} not found`);
        }
      }),
    );
  }

  public updatePoll(id: string, body: UpdatePollDto): Observable<UpdateResult> {
    return from(this.pollRepository.update({ id }, body)).pipe(
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Poll with id ${id} not found`);
        }
      }),
    );
  }

  public closePoll(pollId: string): Observable<UpdateResult> {
    return this.getPollById(pollId).pipe(
      tap(poll => {
        if (poll.status === PollStatus.CLOSED) {
          throw new ResourceClosedException(`Poll with id ${pollId} is already closed`);
        }
      }),
      switchMap(() => from(this.pollRepository.update({ id: pollId }, { status: PollStatus.CLOSED }))),
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Poll with id ${pollId} not found`);
        }
      }),
      switchMap(result => {
        return this.handleClosedPoll(pollId).pipe(switchMap(() => of(result)));
      }),
    );
  }

  public deletePoll(id: string): Observable<DeleteResult> {
    return from(this.pollRepository.delete({ id })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Poll with id ${id} not found`);
        }
      }),
    );
  }

  private handleClosedPoll(pollId: string): Observable<void> {
    return combineLatest([this.getPollById(pollId), this.voteService.getVotesByPoll(pollId)]).pipe(
      switchMap(([poll, votes]) => this.analyticService.createAnalytic(poll, votes.yes, votes.no)),
      switchMap(() => of(undefined)),
    );
  }
}
