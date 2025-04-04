import axios from "@/lib/axios";
import {StrategyInterface} from "@/types";

export const getAllStrategy = async (): Promise<StrategyInterface[]> => {
  const response = await axios.get("/get-strategy/").then((data) => data);
  return response.data;
};

export const getStrategyById = async (
  id: string,
): Promise<StrategyInterface> => {
  const response = await axios.get(`/get-strategy/${id}`).then((data) => data);
  return response.data;
};

export interface createStrategyCredentials {
  name: string;
  description: string;
  days_number: number;
  min_swipes_delay: number;
    max_swipes_delay: number;
  proxy: string | null;
}

export const addStrategy = async (credentials: createStrategyCredentials) => {
  const response = await axios.post("/create-strategy/", credentials);
  return response.data;
};

export const updateStrategy = async (
  id: string,
  credentials: Partial<createStrategyCredentials>,
) => {
  const response = await axios.patch(`/update-strategy/${id}`, credentials);
  return response.data;
};

export const removeStrategy = async (id: string) => {
  const response = await axios.delete(`/delete-strategy/${id}`);
  return response.data;
};
