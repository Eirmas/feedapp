import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiUpdatePollDto, ApiPollEntity, ApiCreatePollDto } from './api/data-contracts';

class PollService {
  private client = new V1(new ApiHttpClient());

  public getPolls(): Promise<AxiosResponse<ApiPollEntity[]>> {
    return this.client.pollControllerGetPolls();
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
