"use server";

import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getHouseholds(): Promise<HouseholdResponseDto[]> {
  const response = await authenticatedClient.fetch("/households");
  if (!response.ok) throw new Error(`Failed to fetch households (${response.status}).`);
  return (await response.json()) as HouseholdResponseDto[];
}
