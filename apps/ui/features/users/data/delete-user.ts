"use server";

import { authenticatedClient } from "@/lib/authenticated-client";

export async function deleteUser(userId: string): Promise<void> {
  const response = await authenticatedClient.fetch(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete user (${response.status}).`);
}
