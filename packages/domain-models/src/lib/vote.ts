export interface VoteDomainModel {
  id: string;
  pollId: string;
  userId?: string;
  answer: boolean;
}
