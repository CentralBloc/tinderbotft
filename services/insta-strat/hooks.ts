import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addInstaStrat,
    createInstaStratCredentials,
    getAllInstaStrats,
    getInstaStratById,
    removeInstaStrat,
    updateInstaStrat
} from "./queries";


export const instaStratQueryKeys = {
    instaStratKey: (id: string) => ["instaStrat", id],
    instaStratsKey: ["instaStrats"],
    addInstaStratKey: ["addInstaStrat"],
    updateInstaStratKey: (id: string) => ["updateInstaStrat", id],
    removeInstaStratKey: (id: string) => ["removeInstaStrat", id],
};

export const useInstaStrat = (id: string) => {
    return useQuery({
        queryKey: instaStratQueryKeys.instaStratKey(id),
        queryFn: () => getInstaStratById(id),
    });
};

export const useInstaStrats = () => {
    return useQuery({
        queryKey: instaStratQueryKeys.instaStratsKey,
        queryFn: () => getAllInstaStrats(),
    });
};

// --------------------------MUTATIONS HOOKS-------------------------- //

export const useAddInstaStrat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: instaStratQueryKeys.addInstaStratKey,
        mutationFn: (credentials: createInstaStratCredentials) =>
            addInstaStrat(credentials),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: instaStratQueryKeys.instaStratsKey,
            });
        }
    });
};

export const useUpdateInstaStrat = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: Partial<createInstaStratCredentials>) =>
            updateInstaStrat(id, credentials),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: instaStratQueryKeys.instaStratsKey,
            });
            queryClient.invalidateQueries({
                queryKey: instaStratQueryKeys.instaStratKey(id),
            });
        }
    });
};

export const useRemoveInstaStrat = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: instaStratQueryKeys.removeInstaStratKey(id),
        mutationFn: () => removeInstaStrat(id),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: instaStratQueryKeys.instaStratsKey,
            });
        }
    });
};
