import type { Request } from 'express';
import type { HouseholdMember } from '../modules/households/entities/household-member.entity.js';
import type { User } from '../modules/users/entities/user.entity.js';

/** Request fields populated by the authentication and household guards. */
export type AuthenticatedRequest = Request & {
  user: User;
  householdMembership?: HouseholdMember;
};
