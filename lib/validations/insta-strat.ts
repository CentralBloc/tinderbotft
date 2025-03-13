import * as z from "zod"

export const instaStratSchema = z.object({
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
    modele: z.string().min(1, {
        message: "The model is required",
    }),
})
