import {changePassword, confirmEmail, forgotPassword, resetPassword,} from "@/services/accounts/queries";
import {useMutation, useQuery} from "@tanstack/react-query";

// --------------- QUERY & MUTATION KEYS --------------- //
export const accountsQueryKeys = {
  confirmEmailKey: ["confirm-email"],
  forgotPasswordKey: ["forgot-password"],
  resetPasswordKey: ["reset-password"],
  changePasswordKey: ["change-password"],
    updateProfilePictureKey: ["update-profile-picture"],
};

// --------------- QUERIES HOOKS --------------- //
export const useConfirmEmail = (token: string) => {
  return useQuery({
    queryKey: accountsQueryKeys.confirmEmailKey,
    queryFn: async () => {
      return await confirmEmail(token);
    },
    enabled: !!token,
  });
};

// --------------- MUTATIONS HOOKS --------------- //
export const useForgotPassword = () => {
  return useMutation({
    mutationKey: accountsQueryKeys.forgotPasswordKey,
    mutationFn: (email: string) => forgotPassword(email),
  });
};

export const useResetPassword = (token: string, uid: string) => {
  return useMutation({
    mutationKey: accountsQueryKeys.resetPasswordKey,
    mutationFn: ({
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    }) => resetPassword(token, uid, newPassword, confirmPassword),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: accountsQueryKeys.changePasswordKey,
    mutationFn: ({
      old_password,
      new_password,
      confirm_password,
    }: {
      old_password: string;
      new_password: string;
      confirm_password: string;
    }) => changePassword(old_password, new_password, confirm_password),
  });
}
