export default function Loading() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
      </header>
      <p className="flex min-h-72 flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading recipes…
      </p>
    </main>
  );
}
