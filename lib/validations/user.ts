import {z} from "zod";

export const updateProfileSchema = z
	.object({
		username: z.string().min(2, {
			message: "Le nom d'utilisateur doit contenir au moins 2 caractères",
		}),
		email: z.string().email({
			message: "Veuillez entrer une adresse mail valide",
		}),
		last_name: z.string().min(2, {
			message: "Le nom doit contenir au moins 2 caractères",
		}),
		first_name: z.string().min(2, {
			message: "Le prénom doit contenir au moins 2 caractères",
		}),
	})
	.required();
