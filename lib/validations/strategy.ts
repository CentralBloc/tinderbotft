import * as z from "zod";

export const strategySchema = z.object({
  name: z
    .string({
      required_error: "Name of the strategy is required",
    })
    .min(1, "Strategy name is required"), // Vérifie que le champ n'est pas vide

  description: z.string().optional(),

  days_number: z.number({
    required_error: "Number of days is required",
  }),
    min_swipes_delay: z.number({
        required_error: "Minimum swipes delay is required",
    }),
    max_swipes_delay: z.number({
        required_error: "Maximum swipes delay is required",
    }),

  proxy: z.string().optional(),
});
