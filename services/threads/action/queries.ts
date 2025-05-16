import axios from '@/lib/axios';


export const getAllThreadActions = async () => {
  const response = await axios.get('/get-thread-actions/');
  return response.data;
}

export const getThreadActionById = async (id: string) => {
  const response = await axios.get(`/get-thread-action/${id}`);
  return response.data;
}

type ThreadAction = {
  type: string;
  min_frequency: number;
  max_frequency: number;
  start_time: string;
  min_post_number: number;
  max_post_number: number;
  media_post_number: number;
  related_day: number;
}

export interface CreateThreadActionCredentials {
  strategy: string;
  actions: ThreadAction[];
}

export const createThreadAction = async (data: CreateThreadActionCredentials) => {
  const response = await axios.post('/create-thread-actions/', data);
  return response.data;
}

export const updateThreadAction = async (id: string, data: CreateThreadActionCredentials) => {
  const response = await axios.put(`/update-thread-action/`, data);
  return response.data;
}

export const deleteThreadAction = async (id: string) => {
  const response = await axios.delete(`/delete-thread-actions/${id}`);
  return response.data;
}

export const getStrategyActions = async (strategyId: string) => {
  const response = await axios.get(`/get-strategy-actions/${strategyId}/`);
  return response.data;
}

