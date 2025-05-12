import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  createThreadAction,
  CreateThreadActionCredentials,
  getAllThreadActions,
  getStrategyActions,
  getThreadActionById
} from "@/services/threads/action/queries";

export const threadActionsQueryKeys = {
  threadActionsKey: (id: string) => ['threadAction', id],
  threadActionsKeyAll: () => ['threadActions'],
  threadStratActionsKey: (id: string) => ['threadStratActions', id],
  threadStratActionsKeyAll: () => ['threadStratActions'],
  threadStratActionsKeyById: (id: string) => ['threadStratActions', id],
  createThreadStratActionsKey: (id: string) => ['createThreadStratActions', id],
  updateThreadStratActionsKey: (id: string) => ['updateThreadStratActions', id],
}

export const useThreadActions = (id: string) => {
  return useQuery({
    queryKey: threadActionsQueryKeys.threadActionsKey(id),
    queryFn: () => getThreadActionById(id),
  });
}

export const useThreadActionsAll = () => {
  return useQuery({
    queryKey: threadActionsQueryKeys.threadActionsKeyAll(),
    queryFn: () => getAllThreadActions(),
  });
}

export const useThreadStratActions = (id: string) => {
  return useQuery({
    queryKey: threadActionsQueryKeys.threadStratActionsKey(id),
    queryFn: () => getThreadActionById(id),
  });
}

export const useThreadStratActionsAll = (id: string) => {
  return useQuery({
    queryKey: threadActionsQueryKeys.threadStratActionsKeyAll(),
    queryFn: () => getStrategyActions(id),
  });
}

export const useCreateThreadStratActions = (data: CreateThreadActionCredentials) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createThreadAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: threadActionsQueryKeys.threadStratActionsKey(data.strategy)
      });
    },
  });
}

export const useUpdateThreadStratActions = (id: string, data: CreateThreadActionCredentials) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createThreadAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: threadActionsQueryKeys.threadStratActionsKey(id)
      });
    },
  });
}
