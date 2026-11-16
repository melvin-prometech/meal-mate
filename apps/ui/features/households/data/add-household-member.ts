"use server";

import type { HouseholdMemberResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function addHouseholdMember(
  householdId: string,
): Promise<HouseholdMemberResponseDto> {
  const response = await authenticatedClient.fetch(`/households/${encodeURIComponent(householdId)}/join`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(`Failed to add household member (${response.status}).`);
  return (await response.json()) as HouseholdMemberResponseDto;
}
