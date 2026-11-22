import { z } from 'zod';
import { HouseholdRole } from './households.enum.js';

export const AddHouseholdMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const UpdateHouseholdMemberRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(HouseholdRole),
});

export const FindHouseholdById = z.object({
    id: z.uuid()
})

export type AddHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;
export type RemoveHouseholdMemberDto = z.infer<typeof AddHouseholdMemberSchema>;
export type UpdateHouseholdMemberRoleDto = z.infer<typeof UpdateHouseholdMemberRoleSchema>;
export type FindHouseholdByIdDto = z.infer<typeof FindHouseholdById>;
