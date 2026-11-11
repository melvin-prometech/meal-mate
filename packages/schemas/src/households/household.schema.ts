import { z } from 'zod';

export const AddHouseholdMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const FindHouseholdById = z.object({
    id: z.uuid()
})

export type AddHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;
export type RemoveHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;
export type FindHouseholdByIdDto = z.infer<typeof FindHouseholdById>;