"use server";

import type { UserResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getUsers(): Promise<UserResponseDto[]> {
  const response = await authenticatedClient.fetch("/users");
  if (!response.ok) throw new Error(`Failed to fetch users (${response.status}).`);
  return (await response.json()) as UserResponseDto[];
}
