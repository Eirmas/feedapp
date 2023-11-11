import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import ResourceClosedException from '../../common/exceptions/resource-closed.exception';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { UpdateResult } from 'typeorm';
import ResourceNotConnectedException from '../../common/exceptions/device-not-connected.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { DeviceEntity } from '../../models';
import { PollService } from '../poll/poll.service';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

describe('DeviceController', () => {
  let deviceController: DeviceController;
  const deviceService: MockProxy<DeviceService> = mock<DeviceService>();
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const configService: MockProxy<ConfigService> = mock<ConfigService>();
  const pollService: MockProxy<PollService> = mock<PollService>();
  const mockAccessToken: AccessTokenData = { sub: 'test-device-id', email: 'test-device-id@feedapp.no', isDevice: true };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        { provide: DeviceService, useValue: deviceService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PollService, useValue: pollService },
      ],
    }).compile();

    deviceController = app.get<DeviceController>(DeviceController);
  });

  afterEach(() => {
    mockClear(deviceService);
  });

  it('should be defined', async () => {
    expect(deviceController).toBeDefined();
    expect(deviceService).toBeDefined();
  });

  describe('GET Device', () => {
    it('should return a device', done => {
      const device = { id: mockAccessToken.sub } as DeviceEntity;
      deviceService.getDeviceById.mockReturnValue(of(device));

      deviceController.getDevice(mockAccessToken).then(result => {
        expect(result).toEqual(device);
        expect(deviceService.getDeviceById).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getDeviceById).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a not found exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.getDeviceById.mockReturnValue(throwError(() => new ResourceNotFoundException(message)));

      deviceController.getDevice(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(message);
        expect(deviceService.getDeviceById).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getDeviceById).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.getDeviceById.mockReturnValue(throwError(() => new Error(message)));

      deviceController.getDevice(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.getDeviceById).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getDeviceById).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('GET Votes', () => {
    it('should return aggregated votes', done => {
      const aggregatedVotes = { yes: 1, no: 0 };
      deviceService.getVotes.mockReturnValue(of(aggregatedVotes));

      deviceController.getVotes(mockAccessToken).then(result => {
        expect(result).toEqual(aggregatedVotes);
        expect(deviceService.getVotes).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getVotes).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a not found exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.getVotes.mockReturnValue(throwError(() => new ResourceNotFoundException(message)));

      deviceController.getVotes(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(message);
        expect(deviceService.getVotes).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getVotes).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.getVotes.mockReturnValue(throwError(() => new Error(message)));

      deviceController.getVotes(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.getVotes).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getVotes).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception when device is not connected to a poll', done => {
      const message = `Device with id ${mockAccessToken.sub} is not connected to a poll`;
      deviceService.getVotes.mockReturnValue(throwError(() => new ResourceNotConnectedException(message)));

      deviceController.getVotes(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.getVotes).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getVotes).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a forbidden exception when device is not allowed to vote on a private poll', done => {
      const message = `Device with id ${mockAccessToken.sub} is not allowed to vote on this poll`;
      deviceService.getVotes.mockReturnValue(throwError(() => new ResourcePermissionDeniedException(message)));

      deviceController.getVotes(mockAccessToken).catch(err => {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual(message);
        expect(deviceService.getVotes).toHaveBeenCalledWith(mockAccessToken.sub);
        expect(deviceService.getVotes).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('POST Create', () => {
    it('should return a jwt token', done => {
      deviceService.createDevice.mockReturnValue(of('test-jwt-token'));

      deviceController.createDevice().then(result => {
        expect(result).toEqual('test-jwt-token');
        expect(deviceService.createDevice).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception', done => {
      const message = 'Bad request';
      deviceService.createDevice.mockReturnValue(throwError(() => new Error(message)));

      deviceController.createDevice().catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.createDevice).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('POST Connect', () => {
    it('should return an update result', done => {
      const updateResult = { affected: 1 } as UpdateResult;
      deviceService.connectDevice.mockReturnValue(of(updateResult));

      deviceController.connectDevice(mockAccessToken, 'test-poll-id').then(result => {
        expect(result).toEqual(updateResult);
        expect(deviceService.connectDevice).toHaveBeenCalledWith(mockAccessToken.sub, 'test-poll-id');
        expect(deviceService.connectDevice).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception', done => {
      const message = 'Bad request';
      deviceService.connectDevice.mockReturnValue(throwError(() => new Error(message)));

      deviceController.connectDevice(mockAccessToken, 'test-poll-id').catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.connectDevice).toHaveBeenCalledWith(mockAccessToken.sub, 'test-poll-id');
        expect(deviceService.connectDevice).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('POST Vote', () => {
    it('should return aggregated votes', done => {
      const aggregatedVotes = { yes: 1, no: 0 };
      deviceService.vote.mockReturnValue(of(aggregatedVotes));

      deviceController.vote(mockAccessToken, { answer: true }).then(result => {
        expect(result).toEqual(aggregatedVotes);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a not found exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.vote.mockReturnValue(throwError(() => new ResourceNotFoundException(message)));

      deviceController.vote(mockAccessToken, { answer: true }).catch(err => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(message);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception', done => {
      const message = `Device with id ${mockAccessToken.sub} not found`;
      deviceService.vote.mockReturnValue(throwError(() => new Error(message)));

      deviceController.vote(mockAccessToken, { answer: true }).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception when device is not connected to a poll', done => {
      const message = `Device with id ${mockAccessToken.sub} is not connected to a poll`;
      deviceService.vote.mockReturnValue(throwError(() => new ResourceNotConnectedException(message)));

      deviceController.vote(mockAccessToken, { answer: true }).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a bad request exception when poll is closed', done => {
      const message = `Poll with id test-poll-id is closed`;
      deviceService.vote.mockReturnValue(throwError(() => new ResourceClosedException(message)));

      deviceController.vote(mockAccessToken, { answer: true }).catch(err => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(message);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should throw a forbidden exception when device is not allowed to vote on a private poll', done => {
      const message = `Device with id ${mockAccessToken.sub} is not allowed to vote on this poll`;
      deviceService.vote.mockReturnValue(throwError(() => new ResourcePermissionDeniedException(message)));

      deviceController.vote(mockAccessToken, { answer: true }).catch(err => {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual(message);
        expect(deviceService.vote).toHaveBeenCalledWith(mockAccessToken.sub, true);
        expect(deviceService.vote).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
