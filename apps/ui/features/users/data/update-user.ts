import type { UpdateUserDto, UserResponseDto } from "@meal-mate/schemas";
import { apiClient } from "@/lib/api-client";

export async function updateUser(userId: string, data: UpdateUserDto): Promise<UserResponseDto> {
  const response = await apiClient.fetch(`/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update user (${response.status}).`);
  return (await response.json()) as UserResponseDto;
}
