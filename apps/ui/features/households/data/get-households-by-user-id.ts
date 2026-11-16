"use server";

import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getHouseholdsByUserId(userId: string): Promise<HouseholdResponseDto[]> {
  const response = await authenticatedClient.fetch(
    `/households/user/${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch households for user (${response.status}).`);
  }

  return (await response.json()) as HouseholdResponseDto[];
}
