"use client";

import { useState } from "react";
import { HouseholdRole, type HouseholdResponseDto, type HouseholdRecipeWithRecipeResponseDto, type MealResponseDto } from "@meal-mate/schemas";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMeal } from "@/features/meals/data/create-meal";
import { deleteMeal } from "@/features/meals/data/delete-meal";
import { getMeals } from "@/features/meals/data/get-meals";
import { useUser } from "@/features/users/components/user-provider";

type MealPlannerProps = {
  household: HouseholdResponseDto;
  recipes: HouseholdRecipeWithRecipeResponseDto[];
  meals: MealResponseDto[];
  weekStart: string;
};

const dateLabel = (date: Date) => date.toISOString().slice(0, 10);
const displayDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(date);

export function MealPlanner({ household, recipes, meals: initialMeals, weekStart }: MealPlannerProps) {
  const { id: userId } = useUser();
  const [selectedWeekStart, setSelectedWeekStart] = useState(weekStart);
  const [meals, setMeals] = useState(initialMeals);
  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [pending, setPending] = useState(false);
  const [isLoadingWeek, setIsLoadingWeek] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canAddMeals = household.members.some(
    (member) => member.userId === userId && member.role === HouseholdRole.ADMIN,
  );
  const start = new Date(`${selectedWeekStart}T00:00:00Z`);
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setUTCDate(day.getUTCDate() + index);
    return day;
  });

  function changeWeek(offset: number) {
    const next = new Date(start);
    next.setUTCDate(next.getUTCDate() + offset * 7);
    void loadWeek(dateLabel(next));
  }

  async function loadWeek(nextWeekStart: string) {
    setError(null);
    setIsLoadingWeek(true);
    try {
      const nextWeekEnd = new Date(`${nextWeekStart}T00:00:00Z`);
      nextWeekEnd.setUTCDate(nextWeekEnd.getUTCDate() + 6);
      const nextMeals = await getMeals(household.id, {
        from: nextWeekStart,
        to: dateLabel(nextWeekEnd),
      });
      setSelectedWeekStart(nextWeekStart);
      setMeals(nextMeals);
      setAddingDate(null);
    } catch {
      setError("Could not load this week. Please try again.");
    } finally {
      setIsLoadingWeek(false);
    }
  }

  async function handleAdd(date: string) {
    if (!selectedRecipe) return;
    setPending(true);
    setError(null);
    try {
      const meal = await createMeal(household.id, { householdRecipeId: selectedRecipe, date });
      setMeals((current) => [...current.filter((item) => item.date !== date), meal]);
      setAddingDate(null);
      setSelectedRecipe("");
    } catch {
      setError("Could not add this meal. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleRemove(meal: MealResponseDto) {
    setPending(true);
    setError(null);
    try {
      await deleteMeal(household.id, meal.id);
      setMeals((current) => current.filter((item) => item.id !== meal.id));
    } catch {
      setError("Could not remove this meal. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section aria-label="Weekly meal planner">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Meal planner</h2>
          <p className="text-sm text-muted-foreground">
            {displayDate(start, { month: "short", day: "numeric" })} – {displayDate(days[6], { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="Previous week" disabled={isLoadingWeek} onClick={() => changeWeek(-1)}><ArrowLeft /></Button>
          <Button type="button" variant="outline" disabled={isLoadingWeek} onClick={() => void loadWeek(dateLabel(getCurrentWeekStart()))}>This week</Button>
          <Button type="button" variant="outline" size="icon" aria-label="Next week" disabled={isLoadingWeek} onClick={() => changeWeek(1)}><ArrowRight /></Button>
        </div>
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
      {isLoadingWeek && <p className="mb-3 text-sm text-muted-foreground" role="status">Loading week…</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {days.map((day) => {
          const date = dateLabel(day);
          const meal = meals.find((item) => item.date === date);
          const recipe = meal && recipes.find((item) => item.id === meal.householdRecipeId)?.recipe;
          return (
            <Card key={date} className="min-h-36 gap-3 py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-sm">{displayDate(day, { weekday: "long" })}</CardTitle>
                <p className="text-xs text-muted-foreground">{displayDate(day, { month: "short", day: "numeric" })}</p>
              </CardHeader>
              <CardContent className="px-4">
                {meal ? (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{recipe?.title ?? "Planned meal"}</p>
                    {canAddMeals && <Button type="button" variant="ghost" size="icon-xs" aria-label="Remove planned meal" disabled={pending} onClick={() => void handleRemove(meal)}><X /></Button>}
                  </div>
                ) : addingDate === date && canAddMeals ? (
                  <div className="space-y-2">
                    <select className="h-8 w-full rounded-md border bg-background px-2 text-sm" value={selectedRecipe} onChange={(event) => setSelectedRecipe(event.target.value)} aria-label="Choose a recipe">
                      <option value="">Choose a saved household recipe</option>
                      {recipes.map(({ id, recipe: item }) => <option key={id} value={id}>{item.title}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" disabled={!selectedRecipe || pending} onClick={() => void handleAdd(date)}>Add</Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => { setAddingDate(null); setSelectedRecipe(""); }}>Cancel</Button>
                    </div>
                  </div>
                ) : canAddMeals ? (
                  <Button type="button" variant="ghost" size="sm" disabled={!recipes.length} onClick={() => { setAddingDate(date); setSelectedRecipe(""); }}><Plus /> Add meal</Button>
                ) : (
                  <p className="text-sm text-muted-foreground">No meal planned</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function getCurrentWeekStart() {
  const today = new Date();
  const day = (today.getDay() + 6) % 7;
  const start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  start.setUTCDate(start.getUTCDate() - day);
  return start;
}
