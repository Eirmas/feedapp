import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock, mockClear, mockDeep } from 'jest-mock-extended';
import { of } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { AppConfig } from '../../common/config/app-config';
import ResourceNotConnectedException from '../../common/exceptions/device-not-connected.exception';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { DeviceEntity } from '../../models';
import PollEntity, { PollStatus } from '../../models/poll.entity';
import { AggregatedVotes } from '../vote/vote.controller';
import { VoteService } from '../vote/vote.service';
import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  const appConfig: MockProxy<AppConfig> = mockDeep<AppConfig>();
  const voteServiceMock: MockProxy<VoteService> = mock<VoteService>();
  const jwtServiceMock: MockProxy<JwtService> = mock<JwtService>();
  const deviceRepository: MockProxy<Repository<DeviceEntity>> = mock<Repository<DeviceEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: getRepositoryToken(DeviceEntity), useValue: deviceRepository },
        { provide: VoteService, useValue: voteServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: AppConfig, useValue: appConfig },
        DeviceService,
      ],
    }).compile();

    deviceService = module.get<DeviceService>(DeviceService);
  });

  afterEach(() => {
    mockClear(deviceRepository);
    mockClear(voteServiceMock);
  });

  it('should be defined', async () => {
    expect(deviceService).toBeDefined();
    expect(deviceRepository).toBeDefined();
  });

  describe('getDeviceById', () => {
    it('should return a device by id', done => {
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.getDeviceById(device.id).subscribe(response => {
        expect(response).toEqual(device);
        done();
      });
    });

    it('should return throw an error if a device is not found', done => {
      deviceRepository.findOneBy.mockResolvedValue(null);

      deviceService.getDeviceById('test-id').subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourceNotFoundException);
          done();
        },
      });
    });
  });

  describe('create', () => {
    it('should create a device', done => {
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      deviceRepository.save.mockResolvedValue(device);
      jwtServiceMock.signAsync.mockResolvedValue('test-token');

      deviceService.createDevice().subscribe(response => {
        expect(response).toEqual('test-token');
        expect(deviceRepository.save).toBeCalledTimes(1);
        expect(jwtServiceMock.signAsync).toBeCalledTimes(1);
        expect(jwtServiceMock.signAsync).toBeCalledWith(
          { sub: device.id, email: `${device.id}@feedapp.no`, isDevice: true },
          { secret: appConfig.config.jwt.secret },
        );
        done();
      });
    });
  });

  describe('connect', () => {
    it('should connect a device', done => {
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      deviceRepository.update.mockResolvedValue({} as UpdateResult);

      deviceService.connectDevice(device.id, 'test-poll-id').subscribe(response => {
        expect(response).toEqual({} as UpdateResult);
        expect(deviceRepository.update).toBeCalledTimes(1);
        expect(deviceRepository.update).toBeCalledWith({ id: device.id }, { connectedPollId: 'test-poll-id' });
        done();
      });
    });
  });

  describe('vote', () => {
    it('should vote', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      const voteResult: AggregatedVotes = { yes: 1, no: 0 };
      deviceRepository.findOneBy.mockResolvedValue(device);
      voteServiceMock.createVote.mockReturnValue(of(null));
      voteServiceMock.getVotesByPoll.mockReturnValue(of(voteResult));

      deviceService.vote(device.id, true).subscribe(response => {
        expect(response).toEqual(voteResult);
        expect(voteServiceMock.createVote).toBeCalledTimes(1);
        expect(voteServiceMock.createVote).toBeCalledWith(device.poll.id, true);
        expect(voteServiceMock.getVotesByPoll).toBeCalledTimes(1);
        expect(voteServiceMock.getVotesByPoll).toBeCalledWith(device.poll.id);
        done();
      });
    });

    it('should throw error if the poll is closed', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.CLOSED } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.vote(device.id, true).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourceClosedException);
          done();
        },
      });
    });

    it('should throw an error if the device is not connected to a poll', done => {
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.vote(device.id, true).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourceNotConnectedException);
          done();
        },
      });
    });

    it('should throw an error if the poll is private and the device doesnt have an invite', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN, private: true, invites: [] } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.vote(device.id, true).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourcePermissionDeniedException);
          done();
        },
      });
    });

    it('should vote successfully if the poll is private and the device has an invite', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN, private: true, invites: [{ email: 'test-id@feedapp.no' }] } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      const voteResult: AggregatedVotes = { yes: 1, no: 0 };
      deviceRepository.findOneBy.mockResolvedValue(device);
      voteServiceMock.createVote.mockReturnValue(of(null));
      voteServiceMock.getVotesByPoll.mockReturnValue(of(voteResult));

      deviceService.vote(device.id, true).subscribe(response => {
        expect(response).toEqual(voteResult);
        expect(voteServiceMock.createVote).toBeCalledTimes(1);
        expect(voteServiceMock.createVote).toBeCalledWith(device.poll.id, true);
        expect(voteServiceMock.getVotesByPoll).toBeCalledTimes(1);
        expect(voteServiceMock.getVotesByPoll).toBeCalledWith(device.poll.id);
        done();
      });
    });
  });

  describe('getVotes', () => {
    it('should get votes', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      const voteResult: AggregatedVotes = { yes: 1, no: 0 };
      deviceRepository.findOneBy.mockResolvedValue(device);
      voteServiceMock.getVotesByPoll.mockReturnValue(of(voteResult));

      deviceService.getVotes(device.id).subscribe(response => {
        expect(response).toEqual(voteResult);
        expect(voteServiceMock.getVotesByPoll).toBeCalledTimes(1);
        expect(voteServiceMock.getVotesByPoll).toBeCalledWith(device.poll.id);
        done();
      });
    });

    it('should throw error if the poll is closed', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.CLOSED } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.getVotes(device.id).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourceClosedException);
          done();
        },
      });
    });

    it('should throw an error if the device is not connected to a poll', done => {
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.getVotes(device.id).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourceNotConnectedException);
          done();
        },
      });
    });

    it('should throw an error if the poll is private and the device doesnt have an invite', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN, private: true, invites: [] } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      deviceRepository.findOneBy.mockResolvedValue(device);

      deviceService.getVotes(device.id).subscribe({
        error: err => {
          expect(err).toBeInstanceOf(ResourcePermissionDeniedException);
          done();
        },
      });
    });

    it('should get votes successfully if the poll is private and the device has an invite', done => {
      const poll = { id: 'test-poll-id', status: PollStatus.OPEN, private: true, invites: [{ email: 'test-id@feedapp.no' }] } as PollEntity;
      const device: DeviceEntity = new DeviceEntity();
      device.id = 'test-id';
      device.poll = poll;

      const voteResult: AggregatedVotes = { yes: 1, no: 0 };
      deviceRepository.findOneBy.mockResolvedValue(device);
      voteServiceMock.getVotesByPoll.mockReturnValue(of(voteResult));

      deviceService.getVotes(device.id).subscribe(response => {
        expect(response).toEqual(voteResult);
        expect(voteServiceMock.getVotesByPoll).toBeCalledTimes(1);
        expect(voteServiceMock.getVotesByPoll).toBeCalledWith(device.poll.id);
        done();
      });
    });
  });
});
