import { z } from 'zod';
import { HouseholdRole } from './households.enum.js';

export const HouseholdMemberResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(HouseholdRole),
  joinedAt: z.date(),
});

export const HouseholdResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  joinCode: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  creatorUserId: z.string().uuid().nullable(),
  members: z.array(HouseholdMemberResponseSchema),
});

export type HouseholdMemberResponseDto = z.infer<typeof HouseholdMemberResponseSchema>;
export type HouseholdResponseDto = z.infer<typeof HouseholdResponseSchema>;
