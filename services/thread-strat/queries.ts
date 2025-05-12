import axios from "@/lib/axios";
import {ThreadStrategyInterface} from "@/types";

export const getAllThreadStrats = async (): Promise<ThreadStrategyInterface[]> => {
  const response = await axios.get("/thread-strat/").then((data) => data);
  return response.data;
}

export const getThreadStratById = async (
  id: string,
): Promise<ThreadStrategyInterface> => {
  const response = await axios.get(`/thread-strat/${id}/`).then((data) => data);
  return response.data;
}

export interface CreateThreadStratCredentials {
  name: string;
  description: string;
  day_number: number;
  proxy: string | null;
}

export const addThreadStrat = async (credentials: CreateThreadStratCredentials) => {
  const response = await axios.post("/thread-strat/create/", credentials);
  return response.data;
}

export const updateThreadStrat = async (
  id: string,
  credentials: Partial<CreateThreadStratCredentials>,
) => {
  const response = await axios.patch(`/thread-strat/update/${id}/`, credentials);
  return response.data;
}

export const removeThreadStrat = async (id: string) => {
  const response = await axios.delete(`/thread-strat/delete/${id}/`);
  return response.data;
};
