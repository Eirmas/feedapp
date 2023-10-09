import axios from 'axios';
import { UserDomainModel } from 'domain-models';

const apiUrl = import.meta.env.VITE_REST_API_URL;

if (!apiUrl) {
  throw new Error('Missing API URL');
}

export const getUser = async (): Promise<UserDomainModel> => (await axios.get<UserDomainModel>(`${apiUrl}/users`)).data;
