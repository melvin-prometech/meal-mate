import { z } from 'zod';

export const CreateIngredientSchema = z.object({
  name: z.string().min(2),
});

export const IngredientResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type CreateIngredientDto = z.infer<typeof CreateIngredientSchema>;
export type IngredientResponseDto = z.infer<typeof IngredientResponseSchema>;