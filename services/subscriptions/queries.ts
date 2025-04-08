import {SubscriptionInterface} from "@/types";
import axios from "@/lib/axios";

export const getAllSubscriptions = async (): Promise<SubscriptionInterface[]> => {
    const response = await axios.get("/get-all-subscriptions/").then((data) => data);
    return response.data;
}

export const getSubscriptionById = async (id: string): Promise<SubscriptionInterface> => {
    const response = await axios.get(`/get-subscription/${id}/`).then((data) => data);
    return response.data;
}

export const addSubscription = async (credentials: SubscriptionInterface) => {
    const response = await axios.post("/create-subscription/", credentials);
    return response.data;
}

export const updateSubscription = async (id: string, credentials: SubscriptionInterface) => {
    const response = await axios.put(`/update-subscription/${id}/`, credentials);
    return response.data;
}

export const removeSubscription = async (id: string) => {
    const response = await axios.delete(`/delete-subscription/${id}/`);
    return response.data;
}

export const getUserSubscriptions = async (userId: string): Promise<SubscriptionInterface[]> => {
    const response = await axios.get(`/get-user-subscriptions/${userId}/`).then((data) => data);
    return response.data;
}