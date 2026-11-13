import { Clock3, Heart, UsersRound } from "lucide-react";
import type { RecipeResponseDto } from "@meal-mate/schemas";

type RecipeCardProps = {
  recipe: RecipeResponseDto;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
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
    <article className="flex min-h-72 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-tight">{recipe.title}</h2>
          {recipe.description?.trim() ? (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          ) : null}
        </div>
        <Heart aria-hidden="true" className="mt-0.5 size-6 shrink-0 fill-current text-foreground" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
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

      {recipe.createdBy ? (
        <footer className="mt-auto border-t border-border pt-4 text-sm text-muted-foreground">
          Created by: {recipe.createdBy}
        </footer>
      ) : null}
    </article>
  );
}
