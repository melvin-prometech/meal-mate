"use server";

import { UpdateRecipeSchema } from "@meal-mate/schemas";
import { revalidatePath } from "next/cache";
import { updateRecipe } from "../data/update-recipe";

export type UpdateRecipeActionResult = { success: true } | { success: false; message: string };

export async function submitRecipeUpdate(
  _previousState: UpdateRecipeActionResult | undefined,
  formData: FormData,
): Promise<UpdateRecipeActionResult> {
  const recipeId = formData.get("recipeId");
  const ingredients = formData.getAll("ingredientName").map((name, index) => ({
    name,
    quantity: optionalNumber(formData.getAll("ingredientQuantity")[index]),
    unit: optionalString(formData.getAll("ingredientUnit")[index]),
    notes: optionalString(formData.getAll("ingredientNotes")[index]),
  }));
  const result = UpdateRecipeSchema.safeParse({
    title: formData.get("title"),
    description: optionalString(formData.get("description")),
    instructions: formData.get("instructions"),
    prepTime: Number(formData.get("prepTime")),
    servings: Number(formData.get("servings")),
    ingredients,
  });

  if (typeof recipeId !== "string" || !recipeId) {
    return { success: false, message: "Could not identify the recipe to update." };
  }
  if (!result.success) return { success: false, message: "Check the recipe details and ingredient fields." };

  try {
    await updateRecipe(recipeId, result.data);
    revalidatePath("/");
    revalidatePath("/favorites");
    return { success: true };
  } catch {
    return { success: false, message: "Could not update the recipe. Please check the details and try again." };
  }
}

function optionalString(value: FormDataEntryValue | null | undefined) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

function optionalNumber(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
