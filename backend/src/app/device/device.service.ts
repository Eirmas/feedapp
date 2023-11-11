import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { AppConfig } from '../../common/config/app-config';
import ResourceNotConnectedException from '../../common/exceptions/device-not-connected.exception';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { DeviceEntity } from '../../models';
import { PollStatus } from '../../models/poll.entity';
import { AggregatedVotes } from '../vote/vote.controller';
import { VoteService } from '../vote/vote.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly voteService: VoteService,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
  ) {}

  public getDeviceById(id: string): Observable<DeviceEntity> {
    return from(this.deviceRepository.findOneBy({ id })).pipe(
      tap((device: DeviceEntity | null) => {
        if (!device) {
          throw new ResourceNotFoundException(`Device with id ${id} not found`);
        }
      }),
    );
  }

  public createDevice(): Observable<string> {
    return from(this.deviceRepository.save(this.deviceRepository.create())).pipe(
      switchMap((device: DeviceEntity) => {
        const payload: AccessTokenData = { sub: device.id, email: `${device.email}`, isDevice: true };
        const { secret } = this.appConfig.config.jwt;
        return from(this.jwtService.signAsync(payload, { secret }));
      }),
    );
  }

  public connectDevice(deviceId: string, pollId: string): Observable<UpdateResult> {
    return from(this.deviceRepository.update({ id: deviceId }, { connectedPollId: pollId }));
  }

  public vote(deviceId: string, answer: boolean): Observable<AggregatedVotes> {
    return from(this.getDeviceById(deviceId)).pipe(
      tap((device: DeviceEntity) => {
        if (!device.poll) {
          throw new ResourceNotConnectedException(`Device with id ${deviceId} is not connected to a poll`);
        }

        if (device.poll.status === PollStatus.CLOSED) {
          throw new ResourceClosedException(`Poll with id ${device.poll.id} is closed`);
        }

        if (device.poll.private && !device.poll.invites.find(invite => invite.email === `${device.email}`)) {
          throw new ResourcePermissionDeniedException(`Device with id ${deviceId} is not allowed to vote on this poll`);
        }
      }),
      switchMap((device: DeviceEntity) => {
        return this.voteService.createVote(device.poll.id, answer).pipe(map(() => device));
      }),
      switchMap((device: DeviceEntity) => this.voteService.getVotesByPoll(device.poll.id)),
    );
  }

  public getVotes(deviceId: string): Observable<AggregatedVotes> {
    return from(this.getDeviceById(deviceId)).pipe(
      tap((device: DeviceEntity) => {
        if (!device.poll) {
          throw new ResourceNotConnectedException(`Device with id ${deviceId} is not connected to a poll`);
        }

        if (device.poll.status === PollStatus.CLOSED) {
          throw new ResourceClosedException(`Poll with id ${device.poll.id} is closed`);
        }

        if (device.poll.private && !device.poll.invites.find(invite => invite.email === `${device.email}`)) {
          throw new ResourcePermissionDeniedException(`Device with id ${deviceId} is not allowed to vote on this poll`);
        }
      }),
      switchMap((device: DeviceEntity) => this.voteService.getVotesByPoll(device.poll.id)),
    );
  }
}
