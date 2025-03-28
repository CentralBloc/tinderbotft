import * as z from 'zod';

export const modelSchema = z.object({
    name: z
        .string({
            required_error: 'A model name is required'
        }).min(1, 'Model name is required'),
    description: z.string().nullable(),
    image: z.any().nullable(),

});
