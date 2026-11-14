"use server";

import type { RemoveHouseholdMemberDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function removeHouseholdMember(
  householdId: string,
  data: RemoveHouseholdMemberDto,
): Promise<void> {
  const response = await authenticatedClient.fetch(`/households/${encodeURIComponent(householdId)}/members`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to remove household member (${response.status}).`);
}
