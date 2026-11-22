import { z } from 'zod';
import { IngredientResponseSchema } from '../ingredients/create.ingredient.schema.js';

export const CreateRecipeIngredientSchema = z.object({
  name: z.string().min(2),
  quantity: z.number().positive().nullable().optional(),
  unit: z.string().max(30).nullable().optional(),
  notes: z.string().max(150).nullable().optional(),
});

export const RecipeIngredientResponseSchema = z.object({
  id: z.uuid(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  notes: z.string().nullable(),
  ingredient: IngredientResponseSchema,
});

export type CreateRecipeIngredientDto = z.infer<typeof CreateRecipeIngredientSchema>;
export type RecipeIngredientResponseDto = z.infer<typeof RecipeIngredientResponseSchema>;