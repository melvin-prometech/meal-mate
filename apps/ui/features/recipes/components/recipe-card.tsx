"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Heart, UsersRound } from "lucide-react";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import {
  addFavoriteRecipeAction,
  removeFavoriteRecipeAction,
} from "@/features/favorites/actions";
import { useUser } from "@/features/users/components/user-provider";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RecipeCardProps = {
  recipe: RecipeResponseDto;
  isFavorite?: boolean;
  removeFromListWhenUnfavorited?: boolean;
};

export function RecipeCard({
  recipe,
  isFavorite = false,
  removeFromListWhenUnfavorited = false,
}: RecipeCardProps) {
  const router = useRouter();
  const { id: userId } = useUser();
  const [favorite, setFavorite] = useState(isFavorite);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState(false);

  async function toggleFavorite() {
    if (isUpdatingFavorite) return;

    const wasFavorite = favorite;
    setFavorite(!wasFavorite);
    setIsUpdatingFavorite(true);
    setFavoriteError(false);
    try {
      if (wasFavorite) {
        await removeFavoriteRecipeAction(userId, recipe.id);
        if (removeFromListWhenUnfavorited) router.refresh();
      } else {
        await addFavoriteRecipeAction(userId, recipe.id);
      }
    } catch {
      setFavorite(wasFavorite);
      setFavoriteError(true);
    } finally {
      setIsUpdatingFavorite(false);
    }
  }
  const prepTime = Number.isFinite(recipe.prepTime) && recipe.prepTime >= 0
    ? recipe.prepTime
    : null;
  const servings = Number.isFinite(recipe.servings) && recipe.servings > 0
    ? recipe.servings
    : null;
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.filter((item) => item?.ingredient?.name?.trim())
    : [];

  return (
    <Card className="min-h-72 gap-0 py-0">
      <CardHeader className="grid-cols-[1fr_auto] items-start px-6 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="truncate text-xl">{recipe.title}</CardTitle>
        <CardAction>
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={isUpdatingFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            className="group rounded-sm text-foreground transition-transform duration-150 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait motion-reduce:transform-none"
          >
            <Heart
              aria-hidden="true"
              className={`size-6 transition-colors duration-150 ${favorite ? "fill-current text-rose-600" : "group-hover:fill-current group-hover:text-rose-500 group-focus-visible:fill-current group-focus-visible:text-rose-500"}`}
            />
          </button>
          {favoriteError ? (
            <span role="alert" className="mt-1 block text-xs text-destructive">
              Couldn’t save. Try again.
            </span>
          ) : null}
        </CardAction>
        {recipe.description?.trim() ? (
          <CardDescription className="col-span-2 line-clamp-2 mt-1">
            {recipe.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
        {prepTime !== null ? (
          <span className="inline-flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-5" />
            <span>{prepTime} min</span>
          </span>
        ) : null}
        {servings !== null ? (
          <span className="inline-flex items-center gap-2">
            <UsersRound aria-hidden="true" className="size-5" />
            <span>{servings} {servings === 1 ? "serving" : "servings"}</span>
          </span>
        ) : null}
      </div>

      {ingredients.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ingredients">
          {ingredients.map((item) => (
            <li
              key={item.id}
              className="rounded-xl bg-muted px-3.5 py-2 text-sm text-foreground"
            >
              {item.ingredient.name}
            </li>
          ))}
        </ul>
      ) : null}

      </CardContent>
      <div className="px-8">
        <Separator />
      </div>
      <CardFooter className="mt-auto min-h-16 justify-start border-t-0 px-8 py-3 text-left text-sm text-muted-foreground">
        Created by: {recipe.createdBy ?? "-"}
      </CardFooter>
    </Card>
  );
}
