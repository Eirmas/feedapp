import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiUpdatePollDto, ApiPollEntity, ApiCreatePollDto, ApiPageDto } from './api/data-contracts';

class PollService {
  private client = new V1(new ApiHttpClient());

  public getPolls(pagination?: Parameters<V1['pollControllerGetPolls']>[0]): Promise<
    AxiosResponse<
      ApiPageDto & {
        data: ApiPollEntity[];
      }
    >
  > {
    return this.client.pollControllerGetPolls(pagination);
  }

  public getPublicPolls(pagination?: Parameters<V1['pollControllerGetPublicPolls']>[0]): Promise<
    AxiosResponse<
      ApiPageDto & {
        data: ApiPollEntity[];
      }
    >
  > {
    return this.client.pollControllerGetPublicPolls(pagination);
  }

  public getPollById(id: string): Promise<AxiosResponse<ApiPollEntity>> {
    return this.client.pollControllerGetPollById(id);
  }

  public createPoll(data: ApiCreatePollDto): Promise<AxiosResponse<ApiPollEntity>> {
    return this.client.pollControllerCreatePoll(data);
  }

  public updatePoll(id: string, data: ApiUpdatePollDto): Promise<AxiosResponse<void>> {
    return this.client.pollControllerUpdatePoll(id, data);
  }

  public closePollById(id: string): Promise<AxiosResponse<void>> {
    return this.client.pollControllerClosePoll(id);
  }

  public deletePollById(id: string): Promise<AxiosResponse<void>> {
    return this.client.pollControllerDeletePoll(id);
  }
}

export default new PollService();
