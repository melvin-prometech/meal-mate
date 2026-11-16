"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HouseholdRole, UserRole, type HouseholdResponseDto } from "@meal-mate/schemas";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/users/components/user-provider";
import { removeHouseholdMember } from "@/features/households/data/remove-household-member";

type HouseholdMembers = HouseholdResponseDto["members"];

export function Members({
  householdId,
  members,
}: {
  householdId: string;
  members: HouseholdMembers;
}) {
  const { id: userId, role: userRole } = useUser();
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentUserRole = members.find((member) => member.userId === userId)?.role;
  const canRemoveMembers = userRole === UserRole.ADMIN || currentUserRole === HouseholdRole.ADMIN;

  async function handleRemove(userIdToRemove: string) {
    if (!window.confirm("Remove this member from the household?")) return;

    setPendingUserId(userIdToRemove);
    setError(null);

    try {
      await removeHouseholdMember(householdId, { userId: userIdToRemove });
      if (userIdToRemove === userId) {
        router.push("/households");
      } else {
        router.refresh();
      }
    } catch {
      setError("Could not remove this member. Please try again.");
    } finally {
      setPendingUserId(null);
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Members</h2>
      {error && <p className="mb-3 text-sm text-destructive" role="alert">{error}</p>}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {members.map((member) => {
          const isCurrentUser = member.userId === userId;

          return (
            <li
              key={member.id}
              className={`group flex items-center justify-between gap-4 px-4 py-3 ${
                isCurrentUser ? "bg-sky-50 dark:bg-sky-950/30" : ""
              }`}
            >
              <span className="min-w-0 truncate font-medium">
                {member.firstName} {member.lastName}
                {isCurrentUser && <span className="ml-2 text-sm font-normal text-sky-700 dark:text-sky-300">You</span>}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm text-muted-foreground">{member.role}</span>
                {canRemoveMembers && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
                    aria-label={`Remove ${member.firstName} ${member.lastName} from household`}
                    title="Remove member"
                    disabled={pendingUserId !== null}
                    onClick={() => void handleRemove(member.userId)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
