import axios from "@/lib/axios";
import {ProxyInterface} from "@/types";

export const getAllProxies = async (): Promise<ProxyInterface[]> => {
  const response = await axios.get("/get-all-proxy/").then((data) => data);
  return response.data;
};

export const getProxyById = async (id: string): Promise<ProxyInterface> => {
  const response = await axios.get(`/get-proxy/${id}`).then((data) => data);
  return response.data;
};

export interface createProxyCredentials {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  rotation_link: string | undefined;
  type: string;
}

export const addProxy = async (credentials: createProxyCredentials) => {
  const response = await axios.post("/create-proxy/", credentials);
  return response.data;
};

export const updateProxy = async (
  id: string,
  credentials: createProxyCredentials,
) => {
  const response = await axios.patch(`/update-proxy/${id}`, credentials);
  return response.data;
};

export const removeProxy = async (id: string) => {
  const response = await axios.delete(`/delete-proxy/${id}`);
  return response.data;
};

export const testProxy = async (id: string) => {
  const response = await axios.get(`/test-proxy/${id}/`);
  return response.data;
};

export const rotateProxy = async (id: string) => {
  const response = await axios.get(`/rotate-proxy/${id}/`)
}
