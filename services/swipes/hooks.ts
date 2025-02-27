import {getSwipesAccount} from "@/services/swipes/queries";
import {useQuery} from "@tanstack/react-query";


export const swipesQueriesKeys = {
    getSwipesAccountKey: ["getSwipesAccount"],
}

export const useSwipesAccount = (id: string) => {
    return useQuery({
        queryKey: swipesQueriesKeys.getSwipesAccountKey,
        queryFn: () => getSwipesAccount(id),
    });
};
