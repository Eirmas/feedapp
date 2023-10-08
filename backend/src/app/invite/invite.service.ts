import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import { Observable, from, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { InviteEntity } from '../../models';
import { PollService } from '../poll/poll.service';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    private readonly pollService: PollService,
  ) {}

  public createInvite(pollId: string, email: string): Observable<InviteEntity> {
    return from(this.inviteRepository.findOne({ where: { pollId, email } })).pipe(
      tap(invite => {
        if (invite) {
          throw new ResourceExistsException(`Invite with email ${email} already exists`);
        }
      }),
      switchMap(() => from(this.inviteRepository.save(this.inviteRepository.create({ pollId, email })))),
    );
  }

  public deleteInvite(pollId: string, email: string): Observable<DeleteResult> {
    return from(this.inviteRepository.delete({ pollId, email })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Invite with email ${email} not found`);
        }
      }),
    );
  }
}
