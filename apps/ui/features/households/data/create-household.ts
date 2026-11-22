"use server";

import type { CreateHouseholdDto, CreateHouseholdResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function createHousehold(data: CreateHouseholdDto): Promise<CreateHouseholdResponseDto> {
  const response = await authenticatedClient.fetch("/households", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create household (${response.status}).`);
  return (await response.json()) as CreateHouseholdResponseDto;
}
