import { Household } from "../entities/household.entity.js";
import { HouseholdResponseDto } from "@meal-mate/schemas";
import { HouseholdMember } from "../entities/household-member.entity.js";
import { HouseholdMemberResponseDto } from "@meal-mate/schemas";

export function mapMemberToResponseDto(
  member: HouseholdMember,
): HouseholdMemberResponseDto {
  return {
    id: member.id,
    userId: member.userId,
    firstName: member.user?.firstName ?? '',
    lastName: member.user?.lastName ?? '',
    role: member.role,
    joinedAt: member.joinedAt,
  };
}

export function mapHouseholdToResponseDto(
  household: Household,
): HouseholdResponseDto {
  return {
    id: household.id,
    name: household.name,
    createdAt: household.createdAt,
    updatedAt: household.updatedAt,
    members: (household.members ?? []).map(mapMemberToResponseDto),
  };
}

export function mapHouseholdsToResponseDto(
  households: Household[],
): HouseholdResponseDto[] {
  return households.map(mapHouseholdToResponseDto);
}