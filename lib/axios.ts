import axios from "axios";
import {getSession, signOut} from "next-auth/react";

/**
 * axios request interceptors
 */
axios.interceptors.request.use(async (config) => {
  config.baseURL = process.env.NEXT_PUBLIC_API_URL!;
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
  }
  config.withCredentials = false;

  const session = await getSession();

  if (session) config.headers.Authorization = `Bearer ${session?.accessToken}`;

  // console.log(session?.accessToken);

  return config;
});

/**
 * axios response interceptors
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) signOut({ callbackUrl: "/" });
    return Promise.reject(error);
  },
);

/**
 * axios form data interceptors
 */
axios.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export default axios;
