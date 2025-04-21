import { toast } from "@/components/ui/use-toast";
import {
  useRemoveBotAccount,
  useStartBotAccount,
  useStopBotAccount,
  useUpdateBotAccountContent,
  useUpdateToken,
  useAddAccountUserName,
  useSetAccountBio
} from "@/services/bot-account/hooks";
import { BotAccountInterface } from "@/types";

/**
 * Custom hook for handling account actions
 * This hook centralizes all account-related actions to be reused across components
 */
export const useAccountActions = (account: BotAccountInterface) => {
  const accountId = account.id;
  
  // Initialize all the mutation hooks
  const deleteMutation = useRemoveBotAccount(accountId);
  const startMutation = useStartBotAccount(accountId);
  const stopMutation = useStopBotAccount(accountId);
  const updateContentMutation = useUpdateBotAccountContent(accountId);
  const updateTokenMutation = useUpdateToken(accountId);
  const addUsernameMutation = useAddAccountUserName(accountId);
  const setBioMutation = useSetAccountBio(accountId);

  // Handle delete action
  const handleDelete = () => {
    return deleteMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          title: "Account deleted successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to delete account",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle start action
  const handleStart = () => {
    return startMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          title: "Account started successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to start account",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle stop action
  const handleStop = () => {
    return stopMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          title: "Account stopped successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to stop account",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle update content action
  const handleUpdateContent = () => {
    return updateContentMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          title: "Account content updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to update account content",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle update token action
  const handleUpdateToken = () => {
    return updateTokenMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({
          title: "Account token updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to update account token",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle add username action
  const handleAddUsername = (username: string) => {
    return addUsernameMutation.mutateAsync(username, {
      onSuccess: () => {
        toast({
          title: "Username added successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to add username",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Handle set bio action
  const handleSetBio = (bio: string) => {
    return setBioMutation.mutateAsync(bio, {
      onSuccess: () => {
        toast({
          title: "Bio updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to update bio",
          description: error.response?.data || "An error occurred",
        });
      },
    });
  };

  // Return all the handlers
  return {
    handleDelete,
    handleStart,
    handleStop,
    handleUpdateContent,
    handleUpdateToken,
    handleAddUsername,
    handleSetBio,
    isDeleting: deleteMutation.isPending,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isUpdatingContent: updateContentMutation.isPending,
    isUpdatingToken: updateTokenMutation.isPending,
    isAddingUsername: addUsernameMutation.isPending,
    isSettingBio: setBioMutation.isPending,
  };
};