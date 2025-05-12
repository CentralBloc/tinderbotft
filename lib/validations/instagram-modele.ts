import * as z from "zod"

export const instagramModelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  bio_list: z.array(z.string()).optional(),
  
})

export type InstagramModelFormValues = z.infer<typeof instagramModelSchema>
