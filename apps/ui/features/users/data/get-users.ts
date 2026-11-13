import type { UserResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getUsers(): Promise<UserResponseDto[]> {
  const response = await apiClient.fetch("/users");
  if (!response.ok) throw new Error(`Failed to fetch users (${response.status}).`);
  return (await response.json()) as UserResponseDto[];
}
