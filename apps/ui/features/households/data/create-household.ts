"use server";

import type { CreateHouseholdDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function createHousehold(userId: string, data: CreateHouseholdDto): Promise<{ id: string }> {
  const response = await authenticatedClient.fetch(`/households/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create household (${response.status}).`);
  return (await response.json()) as { id: string };
}
