"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteRecipe } from "@/features/recipes/data/delete-recipe";

export function RecipeCardAdminActions({ recipeId, recipeTitle, onDeleted }: {
  recipeId: string;
  recipeTitle: string;
  onDeleted: () => void;
}) {
  const router = useRouter();

  async function handleDelete() {
    await deleteRecipe(recipeId);
    router.refresh();
    onDeleted();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button type="button" variant="ghost" size="icon" aria-label={`More options for ${recipeTitle}`} />}
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => void handleDelete()}
          >
            <Trash2 aria-hidden="true" className="mr-2 size-4" />
            Delete recipe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
