import axios from "@/lib/axios";
import {StatsInterface, UserInterface} from "@/types";

/**
 * Query to get user profile information
 * @returns {Promise<UserInterface>} - Object containing user information:
 */
export const getMe = async (): Promise<UserInterface> => {
  const response = await axios.get("/me/").then((data) => data);
  // console.log(response);
  return response.data;
};

export interface createAccountCredentials {
  username: string;
  email: string;
  password: string;
  last_name: string;
  first_name: string;
}

/**
 * Query to update user profile information
 * @param id - User id
 * @param credentials - User data
 * @returns {Promise<UserInterface>} - Object containing user information:
 */
export const editProfile = async (
  id: string,
  credentials: createAccountCredentials,
): Promise<UserInterface> => {
  const response = await axios
    .patch(`/update-profile`, credentials)
    .then((data) => data);
  return response.data;
};

export interface createAccountCredentials {
  username: string;
  email: string;
  password: string;
}

/**
 * Query to create account
 *  @param credentials - User data
 */
export const createAccount = async (credentials: createAccountCredentials) => {
  const response = await axios.post("/register/", credentials);
  // console.log(response);
  return response.data;
};

/**
 * Query to get user stats
 * @returns {Promise<StatsInterface>} - Object containing user stats
 */
export const getUserStats = async (): Promise<StatsInterface[]> => {
  const response = await axios.get("/users/home/dashboard");
  // console.log(response);
  return response.data;
};

export const allowUser = async (id: string) => {
  const response = await axios.patch(`/allow-access/${id}/`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get("/get-all-users/");
  return response.data;
};


export const editUserProfile = async (
    credentials: Partial<createAccountCredentials>,
    ): Promise<UserInterface> => {
    const response = await axios
        .patch(`/update-profile/`, credentials)
        .then((data) => data);
    return response.data;
}
