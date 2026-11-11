import { z } from 'zod';

export const AddHouseholdMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type AddHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;
export type RemoveHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;