import { z } from 'zod';

export const HouseholdRecipeResponseSchema = z.object({
  id: z.uuid(),
  householdId: z.uuid(),
  recipeId: z.uuid(),
  addedBy: z.uuid(),
  createdAt: z.date(),
});

export type HouseholdRecipeResponseDto = z.infer<typeof HouseholdRecipeResponseSchema>;
