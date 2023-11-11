import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import ResourceNotConnectedException from '../../common/exceptions/device-not-connected.exception';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { DeviceEntity } from '../../models';
import { PollStatus } from '../../models/poll.entity';
import appConfig from '../../common/config/app-conf';
import { VoteService } from '../vote/vote.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AggregatedVotes } from '../vote/vote.controller';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly voteService: VoteService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public createDevice(): Observable<string> {
    return from(this.deviceRepository.save(this.deviceRepository.create())).pipe(
      switchMap((device: DeviceEntity) => {
        const payload: AccessTokenData = { sub: device.id, email: `${device.id}@feedapp.no`, isDevice: true };
        const config = this.configService.get<ConfigType<typeof appConfig>>('appConfig');
        return from(this.jwtService.signAsync(payload, { secret: config.jwt.secret }));
      }),
    );
  }

  public connectDevice(deviceId: string, pollId: string): Observable<UpdateResult> {
    return from(this.deviceRepository.update({ id: deviceId }, { connectedPollId: pollId }));
  }

  public vote(deviceId: string, answer: boolean): Observable<AggregatedVotes> {
    return from(this.deviceRepository.findOne({ where: { id: deviceId } })).pipe(
      tap((device: DeviceEntity | null) => {
        if (!device) {
          throw new ResourceNotFoundException(`Device with id ${deviceId} not found`);
        }

        if (!device.poll) {
          throw new ResourceNotConnectedException(`Device with id ${deviceId} is not connected to a poll`);
        }

        if (device.poll.status === PollStatus.CLOSED) {
          throw new ResourceClosedException(`Poll with id ${device.poll.id} is closed`);
        }

        if (device.poll.private && !device.poll.invites.find(invite => invite.email === `${deviceId}@feedapp.no`)) {
          throw new ResourcePermissionDeniedException(`Device with id ${deviceId} is not allowed to vote on this poll`);
        }
      }),
      switchMap((device: DeviceEntity) => {
        return this.voteService.createVote(device.poll.id, answer).pipe(map(() => device));
      }),
      switchMap((device: DeviceEntity) => this.voteService.getVotesByPoll(device.poll.id)),
    );
  }
}
