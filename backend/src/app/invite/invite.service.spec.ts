import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MockProxy, mock, mockClear } from 'jest-mock-extended';
import { DeleteResult, Repository } from 'typeorm';
import { InviteEntity } from '../../models';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  let inviteService: InviteService;
  const inviteRepository: MockProxy<Repository<InviteEntity>> = mock<Repository<InviteEntity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: getRepositoryToken(InviteEntity), useValue: inviteRepository }, InviteService],
    }).compile();

    inviteService = module.get<InviteService>(InviteService);
  });

  afterEach(() => {
    mockClear(inviteRepository);
  });

  it('should be defined', async () => {
    expect(inviteService).toBeDefined();
    expect(inviteRepository).toBeDefined();
  });

  describe('createInvite', () => {
    it('should return invite', done => {
      const pollId = '123';
      const email = 'email@feedapp.no';
      const invite = { pollId, email } as InviteEntity;
      inviteRepository.findOne.mockResolvedValue(null);
      inviteRepository.save.mockResolvedValue(invite);
      inviteRepository.create.mockReturnValue(invite);

      inviteService.createInvite(pollId, email).subscribe(response => {
        expect(response).toBe(invite);
        expect(inviteRepository.findOne).toBeCalledWith({ where: { pollId, email } });
        expect(inviteRepository.save).toBeCalledWith(invite);
        expect(inviteRepository.create).toBeCalledWith({ pollId, email });
        done();
      });
    });

    it('should throw error if invite already exists', done => {
      const pollId = '123';
      const email = 'email@feedapp.no';
      const invite = { pollId, email } as InviteEntity;
      inviteRepository.findOne.mockResolvedValue(invite);

      inviteService.createInvite(pollId, email).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceExistsException);
          expect(error.message).toBe(`Invite with email ${email} already exists`);
          done();
        },
      });
    });
  });

  describe('deleteInvite', () => {
    it('should return delete result', done => {
      const pollId = '123';
      const email = 'email@feedapp.no';
      const deleteResult = { affected: 1 } as DeleteResult;
      inviteRepository.delete.mockResolvedValue(deleteResult);

      inviteService.deleteInvite(pollId, email).subscribe(response => {
        expect(response).toBe(deleteResult);
        expect(inviteRepository.delete).toBeCalledWith({ pollId, email });
        done();
      });
    });

    it('should throw error if invite does not exist', done => {
      const pollId = '123';
      const email = 'email@feedapp.no';
      const deleteResult = { affected: 0 } as DeleteResult;
      inviteRepository.delete.mockResolvedValue(deleteResult);

      inviteService.deleteInvite(pollId, email).subscribe({
        error: error => {
          expect(error).toBeInstanceOf(ResourceNotFoundException);
          expect(error.message).toBe(`Invite with email ${email} not found`);
          done();
        },
      });
    });
  });
});
