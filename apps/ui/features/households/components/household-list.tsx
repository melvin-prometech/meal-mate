"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { HouseholdCard } from "@/features/households/components/household-card";
import { addHouseholdMember } from "@/features/households/data/add-household-member";
import { useUser } from "@/features/users/components/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdList({ households }: { households: HouseholdResponseDto[] }) {
  const { id: userId } = useUser();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoining(true);
    setError(null);
    try {
      await addHouseholdMember({ joinCode });
      setJoinCode("");
      router.refresh();
    } catch {
      setError("Could not join. Check the code and try again.");
    } finally {
      setJoining(false);
    }
  }

  function handleOpen(householdId: string) {
    router.push(`/households/${encodeURIComponent(householdId)}`);
  }

  return (
    <section className="py-6">
      <h2 className="mb-4 text-lg font-semibold">Households</h2>
      <Card className="mb-6 max-w-sm">
        <CardHeader><CardTitle>Join a household</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="flex gap-2">
            <Input aria-label="Household join code" value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Enter a join code" required />
            <Button type="submit" disabled={joining}>{joining ? "Joining…" : "Join"}</Button>
          </form>
        </CardContent>
      </Card>
      {error && <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>}
      {households.length > 0 ? (
        <div className="flex flex-wrap items-start gap-6">
          {households.map((household) => (
            <div key={household.id} className="w-full max-w-sm">
              <HouseholdCard household={household} userId={userId} onOpen={() => handleOpen(household.id)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No households available to join.</p>
      )}
    </section>
  );
}
