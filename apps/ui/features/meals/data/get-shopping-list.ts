"use server";

import type { FindMealsDto, ShoppingListItemDto } from "@meal-mate/schemas";
import { authenticatedClient } from "@/lib/authenticated-client";

export async function getShoppingList(
  householdId: string,
  range: FindMealsDto,
): Promise<ShoppingListItemDto[]> {
  const params = new URLSearchParams();
  if (range.from) params.set("from", range.from);
  if (range.to) params.set("to", range.to);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await authenticatedClient.fetch(
    `/households/${encodeURIComponent(householdId)}/shopping-list${query}`,
  );
  if (!response.ok) throw new Error(`Failed to fetch shopping list (${response.status}).`);
  return (await response.json()) as ShoppingListItemDto[];
}
