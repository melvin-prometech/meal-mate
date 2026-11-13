import type { AddHouseholdMemberDto, HouseholdMemberResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function addHouseholdMember(
  householdId: string,
  data: AddHouseholdMemberDto,
): Promise<HouseholdMemberResponseDto> {
  const response = await apiClient.fetch(`/households/${encodeURIComponent(householdId)}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to add household member (${response.status}).`);
  return (await response.json()) as HouseholdMemberResponseDto;
}
