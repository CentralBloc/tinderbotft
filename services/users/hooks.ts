import {
  allowUser,
  createAccount,
  createAccountCredentials,
  editUserProfile,
  getAllUsers,
  getMe,
  getUserStats,
} from "@/services/users/queries";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {accountsQueryKeys} from "@/services/accounts/hooks";
import {updateProfilePicture} from "@/services/users/file-queries";

// --------------- QUERY & MUTATION KEYS --------------- //
export const usersQueryKeys = {
  usersKey: ["users-list"],
  meKey: ["me"],
  userKey: (id: string) => ["user", id],
  createAccountKey: ["create-account"],
  editProfileKey:  ["edit-profile"],
  deleteUserKey: (id: string) => ["delete-user", id],
  userStatsKey: ["user-stats"],
  allowAccessKey: ["allow-access"],
};

// --------------- QUERIES HOOKS --------------- //
export const useMe = (token: boolean) => {
  return useQuery({
    queryKey: usersQueryKeys.meKey,
    queryFn: getMe,
    enabled: token,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: usersQueryKeys.usersKey,
    queryFn: getAllUsers,
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: usersQueryKeys.userStatsKey,
    queryFn: getUserStats,
  });
};

// --------------- MUTATIONS HOOKS --------------- //
export const useCreateAccount = () => {
  return useMutation({
    mutationKey: usersQueryKeys.createAccountKey,
    mutationFn: (credentials: createAccountCredentials) =>
      createAccount(credentials),
  });
};


export const useAllowAccess = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: usersQueryKeys.allowAccessKey,
    mutationFn: () => allowUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.usersKey,
      });
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: accountsQueryKeys.updateProfilePictureKey,
    mutationFn: (file: File) => updateProfilePicture(file),
    onSuccess() {
        queryClient.invalidateQueries({
            queryKey: usersQueryKeys.meKey,
        });
    }
  });
}

export const useEditUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: usersQueryKeys.editProfileKey,
    mutationFn: (credentials: Partial<createAccountCredentials>) => editUserProfile(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.meKey });
    },
  });
}