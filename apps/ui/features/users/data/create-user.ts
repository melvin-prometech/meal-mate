"use server";

import type { CreateUserDto, UserResponseDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function createUser(data: CreateUserDto): Promise<UserResponseDto> {
  const response = await authenticatedClient.fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create user (${response.status}).`);
  return (await response.json()) as UserResponseDto;
}
