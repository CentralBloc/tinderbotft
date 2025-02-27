import axios from "@/lib/axios";
import {SwipesInterface} from "@/types";

export const getSwipesAccount = async (id: string): Promise<SwipesInterface[]> => {
    const { data } = await axios.get(`/get-account-swipe-session/${id}/`);
    return data;
}
