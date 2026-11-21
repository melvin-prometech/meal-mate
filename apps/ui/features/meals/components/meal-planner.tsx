"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  HouseholdRole,
  type HouseholdResponseDto,
  type HouseholdRecipeWithRecipeResponseDto,
  type MealResponseDto,
} from "@meal-mate/schemas";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMeal } from "@/features/meals/data/create-meal";
import { deleteMeal } from "@/features/meals/data/delete-meal";
import { getMeals } from "@/features/meals/data/get-meals";
import { useUser } from "@/features/users/components/user-provider";
import {
  formatDate,
  formatDateRange,
  getNextSevenDays,
  getNextSevenDaysRange,
} from "@/features/meals/lib/planning-dates";

type MealPlannerProps = {
  household: HouseholdResponseDto;
  recipes: HouseholdRecipeWithRecipeResponseDto[];
  startDate: string;
};

export function MealPlanner({
  household,
  recipes,
  startDate,
}: MealPlannerProps) {
  const { id: userId } = useUser();
  const [meals, setMeals] = useState<MealResponseDto[]>([]);
  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [pending, setPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    void getMeals(household.id, getNextSevenDaysRange(startDate))
      .then((loadedMeals) => {
        if (active) setMeals(loadedMeals);
      })
      .catch(() => {
        if (active)
          setError("Could not load upcoming meals. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [household.id, startDate]);
  const canAddMeals = household.members.some(
    (member) => member.userId === userId && member.role === HouseholdRole.ADMIN,
  );
  const days = getNextSevenDays(startDate);

  async function handleAdd(date: string) {
    if (!selectedRecipe) return;
    setPending(true);
    setError(null);
    try {
      const meal = await createMeal(household.id, {
        householdRecipeId: selectedRecipe,
        date,
      });
      setMeals((current) => [
        ...current.filter((item) => item.date !== date),
        meal,
      ]);
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
    <section aria-label="Meal planner for the next seven days">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Meal planner</h2>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(startDate)}
        </p>
      </div>
      {error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="mb-3 text-sm text-muted-foreground" role="status">
          Loading upcoming meals…
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {days.map((day) => {
          const date = formatDate(day);
          const meal = meals.find((item) => item.date === date);
          const recipe =
            meal &&
            recipes.find((item) => item.id === meal.householdRecipeId)?.recipe;
          return (
            <Card key={date} className="min-h-36 gap-3 py-4">
              <CardHeader className="px-4">
                <CardTitle className="text-sm">{format(day, "EEEE")}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {format(day, "MMM d")}
                </p>
              </CardHeader>
              <CardContent className="px-4">
                {meal ? (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {recipe?.title ?? "Planned meal"}
                    </p>
                    {canAddMeals && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Remove planned meal"
                        disabled={pending}
                        onClick={() => void handleRemove(meal)}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ) : addingDate === date && canAddMeals ? (
                  <div className="space-y-2">
                    <select
                      className="h-8 w-full rounded-md border bg-background px-2 text-sm"
                      value={selectedRecipe}
                      onChange={(event) =>
                        setSelectedRecipe(event.target.value)
                      }
                      aria-label="Choose a recipe"
                    >
                      <option value="">Choose a saved household recipe</option>
                      {recipes.map(({ id, recipe: item }) => (
                        <option key={id} value={id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!selectedRecipe || pending}
                        onClick={() => void handleAdd(date)}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setAddingDate(null);
                          setSelectedRecipe("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : canAddMeals ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!recipes.length}
                    onClick={() => {
                      setAddingDate(date);
                      setSelectedRecipe("");
                    }}
                  >
                    <Plus /> Add meal
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No meal planned
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
