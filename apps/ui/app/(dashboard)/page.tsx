import { BookOpen } from "lucide-react";

export default function RecipesPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-sm text-muted-foreground">Your collection</p>
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
      </header>
      <section className="flex min-h-72 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
        <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <BookOpen className="size-5" strokeWidth={1.7} />
        </span>
        <h2 className="text-sm font-medium">Your recipes will appear here</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Browse your household recipes from this page.
        </p>
      </section>
    </main>
  );
}
