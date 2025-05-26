import {z} from "zod";


export const threadAccountSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  verification_code: z.string().optional(),
  token: z.string().optional(),
  proxy: z.string().optional(),
  strategy: z.string().optional(),
  modele: z.string().optional(),
});
