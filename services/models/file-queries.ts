import {ModelInterface} from "@/types";
import axios from "axios";

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
    const response = await axios.put(`/update-modele/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}