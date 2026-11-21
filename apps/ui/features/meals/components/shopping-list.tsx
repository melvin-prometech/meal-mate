"use client";

import { useEffect, useState } from "react";
import type { ShoppingListItemDto } from "@meal-mate/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { getShoppingList } from "@/features/meals/data/get-shopping-list";
import {
  formatDateRange,
  getNextSevenDaysRange,
} from "@/features/meals/lib/planning-dates";

type ShoppingListProps = {
  householdId: string;
  startDate: string;
};

export function ShoppingList({ householdId, startDate }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    void getShoppingList(householdId, getNextSevenDaysRange(startDate))
      .then((loadedItems) => {
        if (active) setItems(loadedItems);
      })
      .catch(() => {
        if (active)
          setError(
            "Could not load the upcoming shopping list. Please try again.",
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [householdId, startDate]);

  return (
    <section aria-label="Shopping list for the next seven days">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Shopping list</h2>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(startDate)}
        </p>
      </div>
      {error && (
        <p className="mb-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="mb-3 text-sm text-muted-foreground" role="status">
          Loading upcoming shopping list…
        </p>
      )}
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          {items.length ? (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={`${item.ingredientId}:${item.unit ?? ""}`}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {item.quantity === null
                      ? ""
                      : `${item.quantity}${item.unit ? ` ${item.unit}` : ""}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No ingredients for these days yet.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
