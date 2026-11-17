import { z } from 'zod';

export const CreateHouseholdSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
});

export type CreateHouseholdDto = z.infer<typeof CreateHouseholdSchema>;

export const JoinHouseholdSchema = z.object({
  joinCode: z.string().trim().length(6, 'Join code must be 6 characters'),
});

export type JoinHouseholdDto = z.infer<typeof JoinHouseholdSchema>;

export const CreateHouseholdResponseSchema = z.object({
  id: z.string().uuid(),
  joinCode: z.string(),
});

export type CreateHouseholdResponseDto = z.infer<typeof CreateHouseholdResponseSchema>;
