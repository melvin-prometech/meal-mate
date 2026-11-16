import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, ShoppingCart, Users } from "lucide-react";
import { getHouseholdById } from "@/features/households/data/get-household-by-id";
import { Members } from "@/features/households/components/members";
import { HouseholdRecipeList } from "@/features/household-recipes/components/household-recipe-list";
import { getHouseholdRecipes } from "@/features/household-recipes/data/get-household-recipes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HouseholdPage({
  params,
}: PageProps<"/households/[householdId]">) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 text-sm text-muted-foreground sm:px-10">
          Loading household…
        </main>
      }
    >
      <HouseholdContent params={params} />
    </Suspense>
  );
}

async function HouseholdContent({
  params,
}: PageProps<"/households/[householdId]">) {
  const { householdId } = await params;
  let household;

  try {
    household = await getHouseholdById(householdId);
  } catch {
    notFound();
  }
  const recipes = await getHouseholdRecipes(household.id);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="border-b border-border pb-6">
        <p className="mb-2 text-sm text-muted-foreground">Household</p>
        <h1 className="text-2xl font-semibold tracking-tight">{household.name}</h1>
      </header>
      <Tabs defaultValue="meal-planner" className="py-6">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-grid sm:grid-cols-4">
          <TabsTrigger value="meal-planner"><CalendarDays />Meal planner</TabsTrigger>
          <TabsTrigger value="recipes"><BookOpen />Recipes</TabsTrigger>
          <TabsTrigger value="shopping-list"><ShoppingCart />Shopping List</TabsTrigger>
          <TabsTrigger value="members"><Users />Members</TabsTrigger>
        </TabsList>
        <TabsContent value="meal-planner" className="pt-6">
          <SectionPlaceholder title="Meal planner" />
        </TabsContent>
        <TabsContent value="recipes" className="pt-6">
          <HouseholdRecipeList household={household} recipes={recipes} />
        </TabsContent>
        <TabsContent value="shopping-list" className="pt-6">
          <SectionPlaceholder title="Shopping List" />
        </TabsContent>
        <TabsContent value="members" className="pt-6">
          <Members householdId={household.id} members={household.members} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <section className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {title} coming soon
    </section>
  );
}
