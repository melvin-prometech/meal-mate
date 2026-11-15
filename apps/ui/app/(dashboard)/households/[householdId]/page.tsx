import { notFound } from "next/navigation";
import { getHouseholdById } from "@/features/households/data/get-household-by-id";

export default async function HouseholdPage({
  params,
}: PageProps<"/households/[householdId]">) {
  const { householdId } = await params;
  let household;

  try {
    household = await getHouseholdById(householdId);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="border-b border-border pb-6">
        <p className="mb-2 text-sm text-muted-foreground">Household</p>
        <h1 className="text-2xl font-semibold tracking-tight">{household.name}</h1>
      </header>
      <section className="py-6">
        <h2 className="mb-4 text-lg font-semibold">Members</h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {household.members.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="truncate">{member.firstName} {member.lastName}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{member.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
