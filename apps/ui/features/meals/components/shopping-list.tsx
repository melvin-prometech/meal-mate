"use client";

import { useEffect, useState } from "react";
import type { ShoppingListItemDto } from "@meal-mate/schemas";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getShoppingList } from "@/features/meals/data/get-shopping-list";

type ShoppingListProps = {
  householdId: string;
  weekStart: string;
};

const dateLabel = (date: Date) => date.toISOString().slice(0, 10);
const displayDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(date);

export function ShoppingList({ householdId, weekStart }: ShoppingListProps) {
  const [selectedWeekStart, setSelectedWeekStart] = useState(weekStart);
  const [items, setItems] = useState<ShoppingListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    void getShoppingList(householdId, { from: weekStart, to: addDays(weekStart, 6) })
      .then((loadedItems) => {
        if (active) setItems(loadedItems);
      })
      .catch(() => {
        if (active) setError("Could not load this week’s shopping list. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [householdId, weekStart]);
  const start = new Date(`${selectedWeekStart}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  async function loadWeek(nextWeekStart: string) {
    setError(null);
    setIsLoading(true);
    try {
      const nextWeekEnd = new Date(`${nextWeekStart}T00:00:00Z`);
      nextWeekEnd.setUTCDate(nextWeekEnd.getUTCDate() + 6);
      const nextItems = await getShoppingList(householdId, {
        from: nextWeekStart,
        to: dateLabel(nextWeekEnd),
      });
      setSelectedWeekStart(nextWeekStart);
      setItems(nextItems);
    } catch {
      setError("Could not load this week’s shopping list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function changeWeek(offset: number) {
    const next = new Date(start);
    next.setUTCDate(next.getUTCDate() + offset * 7);
    void loadWeek(dateLabel(next));
  }

  function goToThisWeek() {
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    monday.setUTCDate(monday.getUTCDate() - mondayOffset);
    void loadWeek(dateLabel(monday));
  }

  return (
    <section aria-label="Weekly shopping list">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Shopping list</h2>
          <p className="text-sm text-muted-foreground">
            {displayDate(start, { month: "short", day: "numeric" })} – {displayDate(end, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="Previous week" disabled={isLoading} onClick={() => changeWeek(-1)}><ArrowLeft /></Button>
          <Button type="button" variant="outline" disabled={isLoading} onClick={goToThisWeek}>This week</Button>
          <Button type="button" variant="outline" size="icon" aria-label="Next week" disabled={isLoading} onClick={() => changeWeek(1)}><ArrowRight /></Button>
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-destructive" role="alert">{error}</p>}
      {isLoading && <p className="mb-3 text-sm text-muted-foreground" role="status">Loading shopping list…</p>}
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          {items.length ? (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={`${item.ingredientId}:${item.unit ?? ""}`} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="font-medium">{item.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {item.quantity === null ? "" : `${item.quantity}${item.unit ? ` ${item.unit}` : ""}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No ingredients for this week yet.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function addDays(value: string, count: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}
