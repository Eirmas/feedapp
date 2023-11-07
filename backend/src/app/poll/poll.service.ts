import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { DeleteResult, FindOptionsUtils, Repository, UpdateResult } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { PollEntity } from '../../models';
import { PollStatus } from '../../models/poll.entity';
import { AnalyticService } from '../analytic/analytic.service';
import { VoteService } from '../vote/vote.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { RmqService } from '../rmq/rmq.service';
import { HttpService } from '@nestjs/axios';
import { Analytic } from '../../models/analytic.schema';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollEntity)
    private readonly pollRepository: Repository<PollEntity>,
    private readonly voteService: VoteService,
    private readonly analyticService: AnalyticService,
    private readonly rmqService: RmqService,
    private readonly httpService: HttpService,
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
    ).pipe(switchMap(poll => this.getPollById(poll.id)));
  }

  public getPollsByUser(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<PollEntity>> {
    const queryBuilder = this.pollRepository.createQueryBuilder('poll');
    FindOptionsUtils.joinEagerRelations(queryBuilder, queryBuilder.alias, this.pollRepository.metadata);

    queryBuilder
      .where({ ownerId: userId })
      .orderBy('poll.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([queryBuilder.getCount(), queryBuilder.getRawAndEntities()]).pipe(
      map(([itemCount, { entities }]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
      }),
    );
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

  public getPublicPolls(pageOptionsDto: PageOptionsDto): Observable<PageDto<PollEntity>> {
    const queryBuilder = this.pollRepository.createQueryBuilder('poll');
    FindOptionsUtils.joinEagerRelations(queryBuilder, queryBuilder.alias, this.pollRepository.metadata);

    queryBuilder
      .where({ private: false, status: PollStatus.OPEN })
      .orderBy('poll.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([queryBuilder.getCount(), queryBuilder.getRawAndEntities()]).pipe(
      map(([itemCount, { entities }]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
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
      switchMap(analytic => this.dweetAnalytic(analytic)),
      switchMap(analytic => this.rmqService.closePoll(analytic)),
    );
  }

  private dweetAnalytic(analytic: Analytic): Observable<Analytic> {
    return this.httpService.post(`https://dweet.io/dweet/for/${analytic._id}`, analytic).pipe(map(() => analytic));
  }
}
