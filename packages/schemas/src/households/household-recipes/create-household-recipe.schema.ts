import { z } from 'zod';

export const CreateHouseholdRecipeSchema = z.object({
  recipeId: z.string().uuid(),
  addedBy: z.string().uuid(),
});

export type CreateHouseholdRecipeDto = z.infer<typeof CreateHouseholdRecipeSchema>;
