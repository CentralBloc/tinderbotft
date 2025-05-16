import axios from '@/lib/axios';

export const getAllThreadAccounts = async () => {
  const response = await axios.get('/get-all-thread-account/');
  return response.data;
}

export const getThreadAccountById = async (id: string) => {
  const response = await axios.get(`/get-thread-account/${id}`);
  return response.data;
}

export const deleteThreadAccount = async (id: string) => {
  const response = await axios.delete(`/delete-thread-account/${id}`);
  return response.data;
}

export const updateThreadAccount = async (id: string, data: any) => {
  const response = await axios.patch(`/update-thread-account/${id}`, data);
  return response.data;
}

export const syncThreadAccount = async (id: string) => {
  const response = await axios.patch(`/sync-thread-account/${id}`);
  return response.data;
}

export interface CreateThreadAccountCredentials {
  username: string;
  password: string;
  insta_user_id: string;
  token: string;
  proxy: string | null;
  strategy: string | null;
  modele: string | null;

}

export const addThreadAccount = async (credentials: CreateThreadAccountCredentials) => {
  const response = await axios.post('/create-thread-account/', credentials);
  return response.data;
}
