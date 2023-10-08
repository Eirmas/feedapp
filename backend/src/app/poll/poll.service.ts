import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { from, Observable, tap } from 'rxjs';
import { PollEntity } from '../../models';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollEntity)
    private readonly pollRepository: Repository<PollEntity>,
  ) {}

  public createPoll(ownerId: string, createPollDto: CreatePollDto): Observable<PollEntity> {
    return from(
      this.pollRepository.save(
        this.pollRepository.create({
          ...createPollDto,
          ownerId,
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

  public deletePoll(id: string): Observable<DeleteResult> {
    return from(this.pollRepository.delete({ id })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Poll with id ${id} not found`);
        }
      }),
    );
  }
}
