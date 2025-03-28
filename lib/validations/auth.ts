import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse mail valide	",
  }),
  password: z.string().min(1, {
    message: "Mot de passe requis",
  }),
});

export const registerSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters",
    }),
    email: z.string().email({
      message: "Enter a valid email address",
    }),
    last_name: z.string().min(2, {
      message: "The last name must be at least 2 characters",
    }),
    first_name: z.string().min(2, {
      message: "The first name must be at least 2 characters",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(50)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*])(?=.{8,})/, {
        message:
          "The password must contain at least 8 characters, one upper case, one lower case, one number and one special character.",
      }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message:
          "You must accept the terms of use and privacy policy.",
      }),
    }),
  })
  .required();

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid e-mail address",
  }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "Password must contain at least 8 characters",
      })
      .max(50)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*])(?=.{8,})/, {
        message:
          "The password must contain at least 8 characters, one upper case, one lower case, one number and one special character.",
      }),
    confirmPassword: z.string().min(8, {
      message: "Password must contain at least 8 characters",
    }),
    token: z.string(),
    uid: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
