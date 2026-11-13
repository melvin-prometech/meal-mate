import { apiClient } from "@/lib/api-client";

export async function deleteUser(userId: string): Promise<void> {
  const response = await apiClient.fetch(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete user (${response.status}).`);
}
