import {
  addAccount,
  createBotAccountCredentials,
  getAccountById,
  getAllAccounts,
  removeAccount,
  setAccountBio,
  startAccount,
  updateAccount,
  updateAccountContent,
} from "@/services/bot-account/queries";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const botaccountQueryKeys = {
  botaccountKey: (id: string) => ["botaccount", id],
  botaccountsKey: ["botaccounts"],
  addBotaccountKey: ["addBotaccount"],
  updateBotaccountKey: (id: string) => ["updateBotaccount"],
  removeBotaccountKey: (id: string) => ["removeBotaccount"],
  startBotaccountKey: (id: string) => ["startBotaccount"],
  updateBotaccountContentKey: (id: string) => ["updateBotaccountContent"],
  setAccountBioKey: (id: string) => ["setAccountBio", id],
};

export const useBotaccount = (id: string) => {
  return useQuery({
    queryKey: botaccountQueryKeys.botaccountKey(id),
    queryFn: () => getAccountById(id),
  });
};

export const useBotaccounts = () => {
  return useQuery({
    queryKey: botaccountQueryKeys.botaccountsKey,
    queryFn: () => getAllAccounts(),
  });
};

// --------------------------MUTATIONS HOOKS-------------------------- //

export const useAddBotaccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: botaccountQueryKeys.addBotaccountKey,
    mutationFn: (credentials: createBotAccountCredentials) =>
      addAccount(credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountsKey,
      });
    },
  });
};

export const useUpdateBotaccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Partial<createBotAccountCredentials>) =>
      updateAccount(id, credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountsKey,
      });
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountKey(id),
      });
    },
  });
};

export const useRemoveBotAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeAccount(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountsKey,
      });
    },
  });
};

export const useStartBotAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startAccount(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountsKey,
      });
    },
  });
};

export const useUpdateBotAccountContent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateAccountContent(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: botaccountQueryKeys.botaccountsKey,
      });
    },
  });
};

export const useSetAccountBio = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bio: string) => setAccountBio(id, bio),
        onSettled: () => {
        queryClient.invalidateQueries({
            queryKey: botaccountQueryKeys.botaccountsKey,
        });
        },
    });

}
