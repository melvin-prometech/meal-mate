"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { removeHouseholdRecipe } from "@/features/household-recipes/data/remove-household-recipe";

export function HouseholdRecipeActions({ householdId, recipeId, recipeTitle, onRemoved }: {
  householdId: string;
  recipeId: string;
  recipeTitle: string;
  onRemoved: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRemove() {
    setBusy(true);
    setError("");
    try {
      await removeHouseholdRecipe(householdId, recipeId);
      onRemoved();
      router.refresh();
    } catch {
      setError("Could not remove this recipe from the household.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" aria-label={`More options for ${recipeTitle}`} disabled={busy} />}>
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => void handleRemove()}>
            <Trash2 aria-hidden="true" className="mr-2 size-4" />
            Remove from household
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <p role="alert" className="sr-only">{error}</p> : null}
    </div>
  );
}
