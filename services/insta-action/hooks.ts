import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {
    type CreateInstaActionPayload,
    createInstaActions,
    deleteInstaAction,
    getInstaActionById,
    getInstaActions,
    getStratAction,
    updateInstaAction,
} from "./queries"
import {InstaAction} from "@/types";

export const instaActionQueryKeys = {
    instaActions: ["instaActions"],
    instaAction: ["instaAction"],
}

// Hook to fetch all actions for a strategy
export const useInstaActions = () => {
    return useQuery({
        queryKey: ["instaActions"],
        queryFn: () => getInstaActions(),

    })
}

// Hook to fetch a single action by ID
export const useInstaAction = (actionId: string) => {
    return useQuery({
        queryKey: ["instaAction", actionId],
        queryFn: () => getInstaActionById(actionId),
        enabled: !!actionId,
    })
}

export const useStrategyActions = (id: string) => {
    return useQuery({
        queryKey: instaActionQueryKeys.instaActions,
        queryFn: () => getStratAction(id),
    })
}

// Hook to create actions
export const useCreateInstaActions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateInstaActionPayload) => createInstaActions(payload),
        onSuccess: (data, variables) => {
            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({ queryKey: ["instaActions", variables.insta_strat] })
        },
    })
}

// Hook to update an action
export const useUpdateInstaAction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ actionId, data }: { actionId: string; data: Partial<InstaAction> }) =>
            updateInstaAction(actionId, data),
        onSuccess: (data) => {
            // Invalidate the specific action query
            queryClient.invalidateQueries({ queryKey: ["instaAction", data.id] })
            // Invalidate the list query
            queryClient.invalidateQueries({ queryKey: ["instaActions", data.insta_strat] })
        },
    })
}

// Hook to delete an action
export const useDeleteInstaAction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (actionId: string) => deleteInstaAction(actionId),
        onSuccess: (_, actionId) => {
            // We need to invalidate all instaActions queries since we don't know the strategy ID here
            queryClient.invalidateQueries({ queryKey: ["instaActions"] })
            // Also invalidate the specific action query
            queryClient.invalidateQueries({ queryKey: ["instaAction", actionId] })
        },
    })
}

