import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Adresse e-mail est nécessaire" })
    .email({ message: "Adresse e-mail invalide" }),

  password: z
    .string({ message: "Mot de passe est nécessaire" })
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});
