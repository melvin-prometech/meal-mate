"use client";

import { ArrowUpRight, UserPlus } from "lucide-react";
import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type HouseholdCardProps =
  | { household: HouseholdResponseDto; userId: string; onJoin: () => void; onOpen?: never }
  | { household: HouseholdResponseDto; userId: string; onOpen: () => void; onJoin?: never };

export function HouseholdCard({ household, userId, onJoin, onOpen }: HouseholdCardProps) {
  const currentUserRole = household.members.find((member) => member.userId === userId)?.role;
  const memberNames = household.members
    .map((member) => member.firstName.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="grid-cols-[1fr_auto] items-center px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="min-w-0">
          <CardTitle className="truncate text-xl">{household.name}</CardTitle>
          {currentUserRole && (
            <span className="mt-2 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
              Your role · {currentUserRole}
            </span>
          )}
        </div>
        <CardAction className="row-span-1">
          <Button type="button" onClick={onOpen ?? onJoin}>
            {onOpen ? <ArrowUpRight aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
            {onOpen ? "Open" : "Join"}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 items-end justify-between gap-4 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        <p className="truncate text-sm text-muted-foreground" title={memberNames}>
          {memberNames || "No members yet"}
        </p>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">Join code</p>
          <p className="select-all font-mono text-sm font-semibold tracking-wider">{household.joinCode}</p>
        </div>
      </CardContent>
    </Card>
  );
}
