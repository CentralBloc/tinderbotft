import axios from "@/lib/axios";
import {AllModelsInterface, ModelInterface} from "@/types";


export const getAllModels = async (): Promise<AllModelsInterface[]> => {
    const response = await axios.get("/get-all-modele/").then((data) => data);
    console.log(response.data)
    return response.data;
}

export const getModelById = async (id: string): Promise<ModelInterface> => {
    const response = await axios.get(`/get-modele/${id}`).then((data) => data);
    return response.data;
}

export interface createModelCredentials {
    name: string;
    description: string;
    image: File;
}

export const addModel = async (data: FormData): Promise<ModelInterface> => {
    const response = await axios.post("/create-modele/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const updateModel = async (id: string, data: FormData): Promise<ModelInterface> => {
    const response = await axios.patch(`/update-modele/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const removeModel = async (id: string) => {
    const response = await axios.delete(`/delete-modele/${id}`);
    return response.data;
}
