"use client";

import { useState } from "react";
import { HouseholdRole, UserRole, type HouseholdRecipeWithRecipeResponseDto, type HouseholdResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "@/features/recipes/components/recipe-card";
import { HouseholdRecipeActions } from "@/features/household-recipes/components/household-recipe-actions";
import { useUser } from "@/features/users/components/user-provider";

export function HouseholdRecipeList({
  household,
  recipes: initialRecipes,
}: {
  household: HouseholdResponseDto;
  recipes: HouseholdRecipeWithRecipeResponseDto[];
}) {
  const { id: userId, role: userRole } = useUser();
  const [recipes, setRecipes] = useState(initialRecipes);
  const currentHouseholdRole = household.members.find((member) => member.userId === userId)?.role;
  const canManageRecipes = userRole === UserRole.ADMIN || currentHouseholdRole === HouseholdRole.ADMIN;

  return recipes.length ? (
    <div className="flex flex-wrap items-start gap-6">
      {recipes.map(({ id, recipe }) => (
        <div key={id} className="w-full max-w-sm">
          <RecipeCard
            recipe={recipe}
            actions={canManageRecipes ? (
              <HouseholdRecipeActions
                householdId={household.id}
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                onRemoved={() => setRecipes((current) => current.filter((item) => item.id !== id))}
              />
            ) : undefined}
          />
        </div>
      ))}
    </div>
  ) : (
    <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No recipes saved to this household yet.</p>
  );
}
