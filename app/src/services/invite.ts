import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiCreateInviteDto, ApiDeleteInviteDto, ApiInviteEntity } from './api/data-contracts';

class InviteService {
  private client = new V1(new ApiHttpClient());

  public createInvite(pollId: string, data: ApiCreateInviteDto): Promise<AxiosResponse<ApiInviteEntity>> {
    return this.client.inviteControllerCreateInvite(pollId, data);
  }

  public deleteInvite(pollId: string, data: ApiDeleteInviteDto): Promise<AxiosResponse<void>> {
    return this.client.inviteControllerDeletePoll(pollId, data);
  }
}

export default new InviteService();
