"use server";

import type { UserResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getUserById(userId: string): Promise<UserResponseDto> {
  const response = await authenticatedClient.fetch(`/users/${encodeURIComponent(userId)}`);
  if (!response.ok) throw new Error(`Failed to fetch user (${response.status}).`);
  return (await response.json()) as UserResponseDto;
}
