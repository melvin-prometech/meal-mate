import type { RemoveHouseholdMemberDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function removeHouseholdMember(
  householdId: string,
  data: RemoveHouseholdMemberDto,
): Promise<void> {
  const response = await apiClient.fetch(`/households/${encodeURIComponent(householdId)}/members`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to remove household member (${response.status}).`);
}
