"use server";

import type { HouseholdMemberResponseDto, UpdateHouseholdMemberRoleDto } from "@meal-mate/schemas";
import { revalidatePath } from "next/cache";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function updateHouseholdMemberRole(
  householdId: string,
  data: UpdateHouseholdMemberRoleDto,
): Promise<HouseholdMemberResponseDto> {
  const response = await authenticatedClient.fetch(`/households/${encodeURIComponent(householdId)}/members/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update household member role (${response.status}).`);

  revalidatePath("/(dashboard)", "layout");
  return (await response.json()) as HouseholdMemberResponseDto;
}
