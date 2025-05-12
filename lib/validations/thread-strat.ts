import * as z from "zod"

export const threadStratSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "The description is required",
  }),
  day_number: z
    .number()
    .min(1, {
      message: "The number of days is more than 0",
    })
    .default(5),
  proxy: z.string().nullable(),
})
