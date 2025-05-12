import axios from "@/lib/axios";

export const getAllThreadStrategies = async () => {
  const response = await axios.get("/thread-strat/").then((data) => data);
  return response.data;
}

export const getThreadStrategy = async (id: string) => {
  const response = await axios.get(`/thread-strat/${id}/`).then((data) => data);
  return response.data;
}

export interface CreateThreadStratCredentials {
  name: string;
  day_number: string | null;
  description: string | null;
}

export const addThreadStrategy = async (data: CreateThreadStratCredentials) => {
  const response = await axios.post("/thread-strat/create/", data).then((data) => data);
  return response.data;
}

export const updateThreadStrategy = async (id: string, data: Partial<CreateThreadStratCredentials>) => {
  const response = await axios.patch(`/thread-strat/update/${id}/`, data).then((data) => data);
  return response.data;
}

export const deleteThreadStrategy = async (id: string) => {
  const response = await axios.delete(`/thread-strat/delete/${id}/`).then((data) => data);
  return response.data;
}

