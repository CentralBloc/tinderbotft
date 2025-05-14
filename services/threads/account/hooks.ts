import {
  addThreadAccount,
  deleteThreadAccount,
  getAllThreadAccounts,
  getThreadAccountById,
  syncThreadAccount,
  updateThreadAccount
} from "@/services/threads/account/queries";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const threadAccountQueryKeys = {
  threadAccountKey: (id: string) => ['threadAccount', id],
  threadAccountKeyAll: () => ['threadAccount'],
  updateThreadAccountKey: (id: string) => ['updateThreadAccount', id],
  deleteThreadAccountKey: (id: string) => ['deleteThreadAccount', id],
  syncThreadAccountKey: (id: string) => ['syncThreadAccount', id],
}

export const useThreadAccount = (id: string) => {
  return useQuery({
    queryKey: threadAccountQueryKeys.threadAccountKey(id),
    queryFn: () => getThreadAccountById(id),
  });
}

export const useThreadAccountAll = () => {
  return useQuery({
    queryKey: threadAccountQueryKeys.threadAccountKeyAll(),
    queryFn: () => getAllThreadAccounts(),
  });
}

export const useAddThreadAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: threadAccountQueryKeys.threadAccountKeyAll(),
    mutationFn: (data: any) => addThreadAccount(data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKeyAll()
      });
    }
  });
}

export const useUpdateThreadAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: threadAccountQueryKeys.updateThreadAccountKey(id),
    mutationFn: (data: any) => updateThreadAccount(id, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKey(id)
      });
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKeyAll()
      });
    }
  });
}

export const useDeleteThreadAccount = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: threadAccountQueryKeys.deleteThreadAccountKey(id),
    mutationFn: () => deleteThreadAccount(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKeyAll()
      });
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKey(id)
      });
    }
  });
}

export const useSyncThreadAccount = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: threadAccountQueryKeys.syncThreadAccountKey(id),
    mutationFn: () => syncThreadAccount(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKey(id)
      });
      queryClient.invalidateQueries({
        queryKey: threadAccountQueryKeys.threadAccountKeyAll()
      });
    }
  });
}