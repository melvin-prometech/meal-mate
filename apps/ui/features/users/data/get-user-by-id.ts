import type { UserResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function getUserById(userId: string): Promise<UserResponseDto> {
  const response = await apiClient.fetch(`/users/${encodeURIComponent(userId)}`);
  if (!response.ok) throw new Error(`Failed to fetch user (${response.status}).`);
  return (await response.json()) as UserResponseDto;
}
