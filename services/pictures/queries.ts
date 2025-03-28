import axios from "@/lib/axios";

export const getPicture = async (id: string) => {
    const response = await axios.get(`/get-picture/${id}/`);
    return response.data;
}
