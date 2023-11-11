import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { InviteEntity } from '../../models';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { of, throwError } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { PollService } from '../poll/poll.service';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

describe('InviteController', () => {
  let inviteController: InviteController;
  const inviteService: MockProxy<InviteService> = mock<InviteService>();
  const jwtService: MockProxy<JwtService> = mock<JwtService>();
  const configService: MockProxy<ConfigService> = mock<ConfigService>();
  const pollService: MockProxy<PollService> = mock<PollService>();
  const email = 'email@feedapp.no';

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [InviteController],
      providers: [
        { provide: InviteService, useValue: inviteService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PollService, useValue: pollService },
      ],
    }).compile();

    inviteController = app.get<InviteController>(InviteController);
  });

  afterEach(() => {
    mockClear(inviteService);
  });

  it('should be defined', async () => {
    expect(inviteController).toBeDefined();
    expect(inviteService).toBeDefined();
  });

  describe('POST Invite', () => {
    it('should return invite', done => {
      const pollId = '123';
      const invite = { pollId, email } as InviteEntity;
      inviteService.createInvite.mockReturnValue(of(invite));

      inviteController.createInvite(pollId, { email }).then(response => {
        expect(response).toBe(invite);
        done();
      });
    });

    it('should throw error if invite already exists', done => {
      const pollId = '123';
      inviteService.createInvite.mockReturnValue(throwError(() => new ResourceExistsException('error')));

      inviteController.createInvite(pollId, { email }).catch(error => {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw error if invite could not be created', done => {
      const pollId = '123';
      inviteService.createInvite.mockReturnValue(throwError(() => new Error('error')));

      inviteController.createInvite(pollId, { email }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });

  describe('DELETE Invite', () => {
    it('should return delete result', done => {
      const pollId = '123';
      const deleteResult = { affected: 1 } as DeleteResult;
      inviteService.deleteInvite.mockReturnValue(of(deleteResult));

      inviteController.deleteInvite(pollId, { email }).then(response => {
        expect(response).toBe(deleteResult);
        done();
      });
    });

    it('should throw error if invite could not be deleted', done => {
      const pollId = '123';
      inviteService.deleteInvite.mockReturnValue(throwError(() => new Error('error')));

      inviteController.deleteInvite(pollId, { email }).catch(error => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('error');
        done();
      });
    });

    it('should throw error if invite does not exist', done => {
      const pollId = '123';
      inviteService.deleteInvite.mockReturnValue(throwError(() => new ResourceNotFoundException('error')));

      inviteController.deleteInvite(pollId, { email }).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('error');
        done();
      });
    });
  });
});
