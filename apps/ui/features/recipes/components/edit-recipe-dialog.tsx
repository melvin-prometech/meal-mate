"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitRecipeUpdate } from "@/features/recipes/edit-recipe/action";

type Ingredient = { name: string; quantity: string; unit: string; notes: string };

export function EditRecipeDialog({ recipe, open, onOpenChange, onSaved }: { recipe: RecipeResponseDto; open: boolean; onOpenChange: (open: boolean) => void; onSaved: () => void }) {
  const [state, action, pending] = useActionState(submitRecipeUpdate, undefined);
  const onSavedRef = useRef(onSaved);
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => recipe.ingredients.map(({ ingredient, quantity, unit, notes }) => ({
    name: ingredient.name, quantity: quantity?.toString() ?? "", unit: unit ?? "", notes: notes ?? "",
  })));

  onSavedRef.current = onSaved;
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
      onSavedRef.current();
    }
  }, [state?.success]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit recipe</DialogTitle>
          <DialogDescription>Update the recipe details and ingredients.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <input type="hidden" name="recipeId" value={recipe.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" defaultValue={recipe.title} required />
            <Field label="Description" name="description" defaultValue={recipe.description ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prep time (minutes)" name="prepTime" type="number" min="0" defaultValue={recipe.prepTime} required />
            <Field label="Servings" name="servings" type="number" min="1" defaultValue={recipe.servings} required />
          </div>
          <label className="block space-y-2 text-sm font-medium" htmlFor={`instructions-${recipe.id}`}>
            Instructions
            <Textarea id={`instructions-${recipe.id}`} name="instructions" defaultValue={recipe.instructions} required />
          </label>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Ingredients</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setIngredients((current) => [...current, { name: "", quantity: "", unit: "", notes: "" }])}><Plus />Add ingredient</Button>
            </div>
            {ingredients.map((item, index) => (
              <div className="rounded-lg border p-3" key={index}>
                <div className="mb-3 flex items-center justify-between text-sm font-medium">Ingredient {index + 1}
                  {ingredients.length > 1 && <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ingredient ${index + 1}`} onClick={() => setIngredients((current) => current.filter((_, row) => row !== index))}><Trash2 /></Button>}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <IngredientField label="Name" name="ingredientName" value={item.name} onChange={(value) => setIngredient(index, "name", value)} required />
                  <IngredientField label="Quantity" name="ingredientQuantity" type="number" min="0" step="any" value={item.quantity} onChange={(value) => setIngredient(index, "quantity", value)} />
                  <IngredientField label="Unit" name="ingredientUnit" value={item.unit} onChange={(value) => setIngredient(index, "unit", value)} />
                </div>
                <div className="mt-3"><IngredientField label="Notes" name="ingredientNotes" value={item.notes} onChange={(value) => setIngredient(index, "notes", value)} /></div>
              </div>
            ))}
          </section>
          {state && !state.success && <p className="text-sm text-destructive" role="alert">{state.message}</p>}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  function setIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((current) => current.map((item, row) => row === index ? { ...item, [field]: value } : item));
  }
}

function Field({ label, name, type = "text", ...props }: { label: string; name: string; type?: string } & React.ComponentProps<typeof Input>) {
  const id = `${name}-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <label className="block space-y-2 text-sm font-medium" htmlFor={id}>{label}<Input id={id} name={name} type={type} {...props} /></label>;
}

function IngredientField({ label, name, value, onChange, ...props }: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentProps<typeof Input>, "onChange">) {
  const id = `${name}-${label.toLowerCase()}`;
  return <label className="block space-y-2 text-sm font-medium" htmlFor={id}>{label}<Input id={id} name={name} value={value} onChange={(event) => onChange(event.currentTarget.value)} {...props} /></label>;
}
