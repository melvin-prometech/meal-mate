import { CreateHouseholdDialog } from "@/features/households/components/create-household-dialog";
import { HouseholdList } from "@/features/households/components/household-list";
import { getHouseholds } from "@/features/households/data/get-households";

export default async function HouseholdsPage() {
  const households = await getHouseholds();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Create, join or inspect households</p>
          <h1 className="text-2xl font-semibold tracking-tight">Households</h1>
        </div>
        <CreateHouseholdDialog />
      </header>
      <HouseholdList households={households} />
    </main>
  );
}
