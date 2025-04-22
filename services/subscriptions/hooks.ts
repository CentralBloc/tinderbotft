import {
  getAllSubscriptions,
  getSubscriptionById,
  addSubscription,
  updateSubscription,
  removeSubscription,
  getUserSubscriptions
} from "@/services/subscriptions/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriptionInterface } from "@/types";

// --------------- QUERY & MUTATION KEYS --------------- //
export const subscriptionsQueryKeys = {
  subscriptionsKey: ["subscriptions-list"],
  subscriptionKey: (id: string) => ["subscription", id],
  userSubscriptionsKey: (userId: string) => ["user-subscriptions", userId],
  addSubscriptionKey: ["add-subscription"],
  updateSubscriptionKey: (id: string) => ["update-subscription", id],
  removeSubscriptionKey: (id: string) => ["remove-subscription", id],
};

// --------------- QUERIES HOOKS --------------- //
export const useSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionsQueryKeys.subscriptionsKey,
    queryFn: () => getAllSubscriptions(),
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: subscriptionsQueryKeys.subscriptionKey(id),
    queryFn: () => getSubscriptionById(id),
    enabled: !!id,
  });
};

export const useUserSubscriptions = (userId: string) => {
  return useQuery({
    queryKey: subscriptionsQueryKeys.userSubscriptionsKey(userId),
    queryFn: () => getUserSubscriptions(userId),
    enabled: !!userId,
  });
};

// --------------- MUTATIONS HOOKS --------------- //
export const useAddSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscription: SubscriptionInterface) => addSubscription(subscription),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.subscriptionsKey,
      });
    },
  });
};

export const useUpdateSubscription = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscription: SubscriptionInterface) => updateSubscription(id, subscription),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.subscriptionsKey,
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.subscriptionKey(id),
      });
    },
  });
};

export const useRemoveSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.subscriptionsKey,
      });
    },
  });
};