import {
  addStrategy,
  createStrategyCredentials,
  getAllStrategy,
  getStrategyById,
  removeStrategy,
  updateStrategy,
} from "@/services/strategy/queries";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const strategiesQueryKeys = {
  strategiesKey: ["strategies"],
  strategyKey: (id: string) => ["strategies", id],
  addStrategyKey: ["addStrategy"],
  updateStrategyKey: (id: string) => ["updateStrategy", id],
  removeStrategyKey: (id: string) => ["removeStrategy", id],
};

export const useStrategy = (id: string) => {
  return useQuery({
    queryKey: strategiesQueryKeys.strategyKey(id),
    queryFn: () => getStrategyById(id),
  });
};

export const useStrategies = () => {
  return useQuery({
    queryKey: strategiesQueryKeys.strategiesKey,
    queryFn: () => getAllStrategy(),
  });
};

// --------------------------MUTATIONS HOOKS-------------------------- //

export const useAddStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: strategiesQueryKeys.addStrategyKey,
    mutationFn: (credentials: createStrategyCredentials) =>
      addStrategy(credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: strategiesQueryKeys.strategiesKey,
      });
    },
  });
};

export const useUpdateStrategy = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Partial<createStrategyCredentials>) =>
      updateStrategy(id, credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: strategiesQueryKeys.strategiesKey,
      });
      queryClient.invalidateQueries({
        queryKey: strategiesQueryKeys.strategyKey(id),
      });
    },
  });
};

export const useRemoveStrategy = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: strategiesQueryKeys.removeStrategyKey(id),
    mutationFn: () => removeStrategy(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: strategiesQueryKeys.strategiesKey,
      });
    },
  });
};
