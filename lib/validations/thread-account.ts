import {z} from "zod";


export const threadAccountSchema = z.object({
  insta_user_id: z.string().min(1, "User ID is required"),
  token: z.string().min(1, "Token is required"),
  proxy: z.string().optional(),
  strategy: z.string().optional(),
  modele: z.string().optional(),
});
