import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { from, Observable, tap } from 'rxjs';
import { UserEntity } from '../../models';
import { UpdateUserDto } from './dto/update-user.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public getUsersByUser(id: string): Observable<UserEntity[]> {
    return from(this.userRepository.find({ where: { id } }));
  }

  public getUserById(id: string): Observable<UserEntity | null> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      tap(user => {
        if (!user) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }
      }),
    );
  }

  public updateUser(id: string, body: UpdateUserDto): Observable<UpdateResult> {
    return from(this.userRepository.update({ id }, body)).pipe(
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }
      }),
    );
  }

  public deleteUser(id: string): Observable<DeleteResult> {
    return from(this.userRepository.delete({ id })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }
      }),
    );
  }
}
