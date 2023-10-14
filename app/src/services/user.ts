import { AxiosResponse } from 'axios';
import ApiHttpClient from './ApiClient';
import { V1 } from './api/V1';
import { ApiUpdateUserDto, ApiUserEntity } from './api/data-contracts';

class UserService {
  private client = new V1(new ApiHttpClient());

  public getUser(): Promise<AxiosResponse<ApiUserEntity>> {
    return this.client.userControllerGetUser();
  }

  public getUserById(userId: string): Promise<AxiosResponse<ApiUserEntity>> {
    return this.client.userControllerGetUserById(userId);
  }

  public updateUser(data: ApiUpdateUserDto): Promise<AxiosResponse<void>> {
    return this.client.userControllerUpdateUser(data);
  }

  public deleteUser(): Promise<AxiosResponse<void>> {
    return this.client.userControllerDeleteUser();
  }
}

export default new UserService();
