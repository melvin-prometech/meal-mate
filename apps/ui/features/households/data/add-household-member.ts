"use server";

import type { HouseholdMemberResponseDto } from "@meal-mate/schemas";
import type { JoinHouseholdDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function addHouseholdMember(
  data: JoinHouseholdDto,
): Promise<HouseholdMemberResponseDto> {
  const response = await authenticatedClient.fetch("/households/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to add household member (${response.status}).`);
  return (await response.json()) as HouseholdMemberResponseDto;
}
