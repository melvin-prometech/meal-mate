import { z } from 'zod';

export const CreateFavoriteRecipeSchema = z.object({
  recipeId: z.string().uuid(),
});

export type CreateFavoriteRecipeDto = z.infer<typeof CreateFavoriteRecipeSchema>;