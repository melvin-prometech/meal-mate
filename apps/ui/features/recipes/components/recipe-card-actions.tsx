"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import { UserRole } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { addHouseholdRecipe } from "@/features/household-recipes/data/add-household-recipe";
import { getHouseholdRecipes } from "@/features/household-recipes/data/get-household-recipes";
import { getHouseholdsByUserId } from "@/features/households/data/get-households-by-user-id";
import { deleteRecipe } from "@/features/recipes/data/delete-recipe";
import { useUser } from "@/features/users/components/user-provider";

type HouseholdOption = { id: string; name: string; saved: boolean };

export function RecipeCardActions({ recipeId, recipeTitle, onDeleted }: {
  recipeId: string;
  recipeTitle: string;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const { id: userId, role } = useUser();
  const [open, setOpen] = useState(false);
  const [households, setHouseholds] = useState<HouseholdOption[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadHouseholds() {
    if (households) return;
    try {
      const memberships = await getHouseholdsByUserId(userId);
      const options = await Promise.all(memberships.map(async (household) => {
        const savedRecipes = await getHouseholdRecipes(household.id);
        return { id: household.id, name: household.name, saved: savedRecipes.some((item) => item.recipe.id === recipeId) };
      }));
      setHouseholds(options);
    } catch {
      setError("Could not load households.");
      setHouseholds([]);
    }
  }

  async function toggleHousehold(household: HouseholdOption) {
    setBusyId(household.id);
    setError("");
    try {
      await addHouseholdRecipe(household.id, { recipeId, addedBy: userId });
      setHouseholds((current) => current?.map((item) => item.id === household.id ? { ...item, saved: !item.saved } : item) ?? null);
      router.refresh();
    } catch {
      setError(`Could not update ${household.name}.`);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    await deleteRecipe(recipeId);
    router.refresh();
    onDeleted();
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={<Button type="button" variant="ghost" size="icon" aria-label={`More options for ${recipeTitle}`} />}
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub onOpenChange={(isOpen) => { if (isOpen) void loadHouseholds(); }}>
          <DropdownMenuSubTrigger>
            Add to household
            <ChevronRight aria-hidden="true" className="ml-auto size-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {households === null ? <div className="px-2 py-2 text-sm text-muted-foreground">Loading…</div> : households.length === 0 ? <div className="px-2 py-2 text-sm text-muted-foreground">No households yet</div> : households.map((household) => (
              <DropdownMenuItem
                key={household.id}
                disabled={household.saved || busyId !== null}
                onClick={() => void toggleHousehold(household)}
                className={household.saved ? "text-muted-foreground opacity-60" : undefined}
              >
                {household.saved ? <Check aria-hidden="true" className="mr-2 size-4" /> : <span className="mr-2 size-4" />}
                <span className="truncate">{household.name}</span>
                <span className="ml-auto pl-3 text-xs text-muted-foreground">{household.saved ? "Saved" : "Add"}</span>
              </DropdownMenuItem>
            ))}
            {error ? <div role="status" className="px-2 py-1 text-xs text-destructive">{error}</div> : null}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {role === UserRole.ADMIN ? (
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => void handleDelete()}>
            <Trash2 aria-hidden="true" className="mr-2 size-4" />
            Delete recipe
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
