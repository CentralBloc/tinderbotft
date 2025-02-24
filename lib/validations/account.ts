import * as z from "zod";

export const accountSchema = z.object({
  title: z
    .string({
      required_error: "A title is required",
    })
    .min(1, "Account name is required"),
  modele: z
    .string({
      required_error: "A modele is required",
    })
    .min(1, "Model name is required"),
  token: z
    .string({
      required_error: "A token is required",
    })
    .min(1, "Token is required"),
  refresh_token: z.string().nullable(),
  strategy: z.string().optional(),
  proxy: z.string().optional(),
  device_id: z.string().optional(),
  min_age: z.number().optional(),
  max_age: z.number().optional(),
  distance: z.number().optional(),
  timezone_field: z.string({
    required_error: "A timezone is required",
  }),
});
