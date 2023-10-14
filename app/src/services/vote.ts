import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiCreateVoteDto, ApiGetVotesDao } from './api/data-contracts';

class VoteService {
  private client = new V1(new ApiHttpClient());

  public createVote(pollId: string, data: ApiCreateVoteDto): Promise<AxiosResponse<void>> {
    return this.client.voteControllerCreateVote(pollId, data);
  }

  public getVotesByPoll(pollId: string): Promise<AxiosResponse<ApiGetVotesDao>> {
    return this.client.voteControllerGetVotesByPoll(pollId);
  }
}

export default new VoteService();
