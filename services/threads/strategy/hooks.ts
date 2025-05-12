import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  addThreadStrategy,
  CreateThreadStratCredentials,
  deleteThreadStrategy,
  getAllThreadStrategies,
  getThreadStrategy,
  updateThreadStrategy,
} from "@/services/threads/strategy/queries";


export const threadStratQueryKeys = {
  threadStratKey: (id: string) => ["thread-strat", id],
  threadStratsKey: ["thread-strat"],
  addThreadStratKey: ["thread-strat", "add"],
  removeThreadStratKey: (id: string) => ["thread-strat", "remove", id],
  updateThreadStratKey: (id: string) => ["thread-strat", "update", id],
}

export const useThreadStrat = (id: string) => {
  return useQuery({
    queryKey: threadStratQueryKeys.threadStratKey(id),
    queryFn: () => getThreadStrategy(id),
  });
};

export const useThreadStrats = () => {
  return useQuery({
    queryKey: threadStratQueryKeys.threadStratsKey,
    queryFn: () => getAllThreadStrategies(),
  });
};

// --------------------------MUTATIONS HOOKS-------------------------- //

export const useAddThreadStrat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: threadStratQueryKeys.addThreadStratKey,
    mutationFn: (credentials: CreateThreadStratCredentials) =>
      addThreadStrategy(credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadStratQueryKeys.threadStratsKey,
      });
    }
  });
};

export const useUpdateThreadStrat = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Partial<CreateThreadStratCredentials>) =>
      updateThreadStrategy(id, credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadStratQueryKeys.threadStratKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: threadStratQueryKeys.threadStratsKey,
      });
    }
  });
};

export const useRemoveThreadStrat = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: threadStratQueryKeys.removeThreadStratKey(id),
    mutationFn: () => deleteThreadStrategy(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: threadStratQueryKeys.threadStratKey(id),
      });
    }
  });
};
