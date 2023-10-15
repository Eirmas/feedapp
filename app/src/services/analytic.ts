import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiAnalytic, ApiPageDto } from './api/data-contracts';

class AnalyticService {
  private client = new V1(new ApiHttpClient());

  public getAnalyticByPoll(pollId: string): Promise<AxiosResponse<ApiAnalytic>> {
    return this.client.analyticControllerGetAnalyticByPoll(pollId);
  }

  public getAnalyticsByPoll(pagination?: Parameters<V1['analyticControllerGetAnalytics']>[0]): Promise<
    AxiosResponse<
      ApiPageDto & {
        data: ApiAnalytic[];
      }
    >
  > {
    return this.client.analyticControllerGetAnalytics(pagination);
  }
}

export default new AnalyticService();
