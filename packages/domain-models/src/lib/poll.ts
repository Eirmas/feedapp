import { InviteDomainModel } from './invite';
import { UserDomainModel } from './user';

export enum PollStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface PollDomainModel {
  id: string;
  ownerId: string;
  title: string;
  question: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  status: PollStatus;
  owner: UserDomainModel;
  invites: InviteDomainModel[];
}
