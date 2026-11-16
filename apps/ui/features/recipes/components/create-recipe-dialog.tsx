"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitRecipe } from "../actions";

type IngredientRow = { id: number };

export function CreateRecipeDialog() {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ id: 0 }]);
  const [state, action, pending] = useActionState(submitRecipe, {});

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setIngredients([{ id: Date.now() }]);
    }
  }, [state.success]);

  function addIngredient() {
    setIngredients((current) => [...current, { id: Date.now() }]);
  }

  function removeIngredient(id: number) {
    setIngredients((current) => current.length > 1 ? current.filter((row) => row.id !== id) : current);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus />Create recipe</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a recipe</DialogTitle>
          <DialogDescription>Add the recipe details and its ingredients.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" required placeholder="e.g. Tomato pasta" />
            <Field label="Description" name="description" placeholder="A short introduction" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prep time (minutes)" name="prepTime" type="number" min="0" required />
            <Field label="Servings" name="servings" type="number" min="1" required />
          </div>
          <label className="block space-y-2 text-sm font-medium" htmlFor="recipe-instructions">
            Instructions
            <Textarea id="recipe-instructions" name="instructions" required placeholder="Describe how to make it…" />
          </label>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Ingredients</h3>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}><Plus />Add ingredient</Button>
            </div>
            {ingredients.map((ingredient, index) => (
              <div className="rounded-lg border p-3" key={ingredient.id}>
                <div className="mb-3 flex items-center justify-between text-sm font-medium">Ingredient {index + 1}
                  {ingredients.length > 1 && <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ingredient ${index + 1}`} onClick={() => removeIngredient(ingredient.id)}><Trash2 /></Button>}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Name" name="ingredientName" required placeholder="e.g. Tomatoes" />
                  <Field label="Quantity" name="ingredientQuantity" type="number" min="0" step="any" placeholder="Optional" />
                  <Field label="Unit" name="ingredientUnit" placeholder="e.g. grams" />
                </div>
                <div className="mt-3"><Field label="Notes" name="ingredientNotes" placeholder="Optional notes" /></div>
              </div>
            ))}
          </section>
          {state.message && <p className="text-sm text-destructive" role="alert">{state.message}</p>}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create recipe"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, name, type = "text", ...props }: { label: string; name: string; type?: string } & React.ComponentProps<typeof Input>) {
  const id = `${name}-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <label className="block space-y-2 text-sm font-medium" htmlFor={id}>{label}<Input id={id} name={name} type={type} {...props} /></label>;
}
