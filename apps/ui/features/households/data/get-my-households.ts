"use server";

import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getMyHouseholds(): Promise<HouseholdResponseDto[]> {
  const response = await authenticatedClient.fetch("/households/mine");

  if (!response.ok) {
    throw new Error(`Failed to fetch your households (${response.status}).`);
  }

  return (await response.json()) as HouseholdResponseDto[];
}
