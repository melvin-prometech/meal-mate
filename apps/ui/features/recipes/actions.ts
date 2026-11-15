"use server";

import { CreateRecipeSchema } from "@meal-mate/schemas";
import { revalidatePath } from "next/cache";
import { createRecipe } from "./data/create-recipe";

export type CreateRecipeState = { message?: string; success?: boolean };

export async function submitRecipe(
  _previousState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  const ingredients = formData.getAll("ingredientName").map((name, index) => ({
    name,
    quantity: optionalNumber(formData.getAll("ingredientQuantity")[index]),
    unit: optionalString(formData.getAll("ingredientUnit")[index]),
    notes: optionalString(formData.getAll("ingredientNotes")[index]),
  }));

  const result = CreateRecipeSchema.safeParse({
    title: formData.get("title"),
    description: optionalString(formData.get("description")),
    instructions: formData.get("instructions"),
    prepTime: Number(formData.get("prepTime")),
    servings: Number(formData.get("servings")),
    createdBy: formData.get("createdBy"),
    ingredients,
  });

  if (!result.success) return { message: "Check the recipe details and ingredient fields." };

  try {
    await createRecipe(result.data);
    revalidatePath("/");
    return { success: true };
  } catch {
    return { message: "Could not create the recipe. Please try again." };
  }
}

function optionalString(value: FormDataEntryValue | undefined | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

function optionalNumber(value: FormDataEntryValue | undefined) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
