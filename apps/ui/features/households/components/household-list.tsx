"use client";

import { useRouter } from "next/navigation";
import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { HouseholdCard } from "@/features/households/components/household-card";
import { addHouseholdMember } from "@/features/households/data/add-household-member";
import { useUser } from "@/features/users/components/user-provider";

export function HouseholdList({ households }: { households: HouseholdResponseDto[] }) {
  const { id: userId } = useUser();
  const router = useRouter();

  async function handleJoin(householdId: string) {
    await addHouseholdMember(householdId);
    router.refresh();
    router.push(`/households/${encodeURIComponent(householdId)}`);
  }

  function handleOpen(householdId: string) {
    router.push(`/households/${encodeURIComponent(householdId)}`);
  }

  return (
    <section className="py-6">
      <h2 className="mb-4 text-lg font-semibold">Households</h2>
      {households.length > 0 ? (
        <div className="flex flex-wrap items-start gap-6">
          {households.map((household) => (
            <div key={household.id} className="w-full max-w-sm">
              {household.members.some((member) => member.userId === userId) ? (
                <HouseholdCard household={household} userId={userId} onOpen={() => handleOpen(household.id)} />
              ) : (
                <HouseholdCard household={household} userId={userId} onJoin={() => void handleJoin(household.id)} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No households available to join.</p>
      )}
    </section>
  );
}
