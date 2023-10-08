import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { InviteEntity } from '../../models';
import { PollService } from '../poll/poll.service';
import { Observable, from, switchMap, tap } from 'rxjs';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    private readonly pollService: PollService,
  ) {}

  public createInvite(pollId: string, userId: string, email: string): Observable<InviteEntity> {
    return this.pollService.getPollById(pollId).pipe(
      switchMap(poll => {
        if (poll.ownerId !== userId) {
          throw new ResourcePermissionDeniedException('You do not have permission to invite users to this poll');
        }

        return from(
          this.inviteRepository.save(
            this.inviteRepository.create({
              pollId,
              email,
            }),
          ),
        );
      }),
    );
  }

  public deleteInvite(pollId: string, userId: string, email): Observable<DeleteResult> {
    return this.pollService.getPollById(pollId).pipe(
      switchMap(poll => {
        if (poll.ownerId !== userId) {
          throw new ResourcePermissionDeniedException('You do not have permission to delete invites from this poll');
        }

        return from(this.inviteRepository.delete({ pollId, email }));
      }),
      switchMap(() => from(this.inviteRepository.delete({ pollId, email }))),
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Invite with email ${email} not found`);
        }
      }),
    );
  }
}
