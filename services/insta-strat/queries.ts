import axios from "@/lib/axios";
import {InstaStratInterface} from "../../types";


export const getAllInstaStrats = async (): Promise<InstaStratInterface[]> => {
    const response = await axios.get("/get-insta-strats/").then((data) => data);
    return response.data;
}

export const getInstaStratById = async (
    id: string,
): Promise<InstaStratInterface> => {
    const response = await axios.get(`/get-insta-strat/${id}/`).then((data) => data);
    return response.data;
}

export interface createInstaStratCredentials {
    name: string;
    description: string;
    day_number: number;
    modele: string | null;
}

export const addInstaStrat = async (credentials: createInstaStratCredentials) => {
    const response = await axios.post("/create-insta-strat/", credentials);
    return response.data;
}

export const updateInstaStrat = async (
    id: string,
    credentials: Partial<createInstaStratCredentials>,
) => {
    const response = await axios.patch(`/update-insta-strat/${id}/`, credentials);
    return response.data;
}

export const removeInstaStrat = async (id: string) => {
    const response = await axios.delete(`/delete-insta-strat/${id}/`);
    return response.data;
};
