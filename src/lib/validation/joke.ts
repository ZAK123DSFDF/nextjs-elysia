// lib/validations/joke.ts
import { z } from "zod";

export const SuccessBodySchema = z.object({
  rememberMe: z.boolean(),
});

export type SuccessBody = z.infer<typeof SuccessBodySchema>;
