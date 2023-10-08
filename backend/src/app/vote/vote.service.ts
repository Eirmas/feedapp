import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { VoteEntity } from '../../models';
import { PollService } from '../poll/poll.service';
import { UserService } from '../user/user.service';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly voteRepository: Repository<VoteEntity>,
    private readonly pollService: PollService,
    private readonly userService: UserService,
  ) {}

  public getVotesByPoll(pollId: string, userId?: string): Observable<VoteEntity[]> {
    return this.hasPermissionToPoll(pollId, userId).pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          throw new ResourceNotFoundException(`Poll with id ${pollId} not found`);
        }

        return from(this.voteRepository.find({ where: { pollId } }));
      }),
    );
  }

  public vote(pollId: string, answer: boolean, userId?: string): Observable<VoteEntity> {
    return this.hasPermissionToPoll(pollId, userId).pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          throw new ResourceNotFoundException(`Poll with id ${pollId} not found`);
        }

        return from(
          this.voteRepository.save(
            this.voteRepository.create({
              pollId,
              userId,
              answer,
            }),
          ),
        );
      }),
    );
  }

  private hasPermissionToPoll(pollId: string, userId?: string): Observable<boolean> {
    return this.pollService.getPollById(pollId).pipe(
      switchMap(poll => {
        if (poll.private && !userId) {
          return of(false);
        }

        if (poll.private && userId) {
          return this.userService.getUserById(userId).pipe(
            switchMap(user => {
              if (!user) {
                return of(false);
              } else {
                return of(!!poll.invites.find(invite => invite.email === user.email));
              }
            }),
          );
        }

        return of(true);
      }),
      catchError(() => of(false)),
    );
  }
}
