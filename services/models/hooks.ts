import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addModel, getAllModels, getModelById, removeModel, updateModel} from "@/services/models/queries";


export const modelsQueryKeys = {
    modelKey: (id: string) => ["model", id],
    modelsKey: ["models"],
    addModelKey: ["addModel"],
    updateModelKey: (id: string) => ["updateModel", id],
    removeModelKey: (id: string) => ["removeModel", id],
}

export const useModels = () => {
    return useQuery({
        queryKey: modelsQueryKeys.modelsKey,
        queryFn: () => getAllModels(),
    })
}

export const useModel = (id: string) => {
    return useQuery({
        queryKey: modelsQueryKeys.modelKey(id),
        queryFn: () => getModelById(id),
    })
}

// --------------------------MUTATIONS HOOKS-------------------------- //

export const useAddModel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: modelsQueryKeys.addModelKey,
        mutationFn: (credential: FormData) => addModel(credential),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: modelsQueryKeys.modelsKey,
            });
        },
    });
}

export const useUpdateModel = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credential: FormData) => updateModel(id, credential),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: modelsQueryKeys.modelsKey,
            });
            queryClient.invalidateQueries({
                queryKey: modelsQueryKeys.modelKey(id),
            });
        },
    });
}

export const useRemoveModel = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: modelsQueryKeys.removeModelKey(id),
        mutationFn: () => removeModel(id),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: modelsQueryKeys.modelsKey,
            });
            queryClient.invalidateQueries({
                queryKey: modelsQueryKeys.modelKey(id),
            });
        },
    });
}
