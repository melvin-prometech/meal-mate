"use client";

import { UserPlus } from "lucide-react";
import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type HouseholdCardProps = {
  household: HouseholdResponseDto;
  onJoin: () => void;
};

export function HouseholdCard({ household, onJoin }: HouseholdCardProps) {
  const memberNames = household.members
    .map((member) => member.firstName.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="grid-cols-[1fr_auto] items-center px-6 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="truncate text-xl">{household.name}</CardTitle>
        <CardAction className="row-span-1">
          <Button type="button" onClick={onJoin}>
            <UserPlus aria-hidden="true" />
            Join
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap gap-2" aria-label="Household member roles">
          {household.members.map((member) => (
            <span
              key={member.id}
              className="w-fit rounded-md bg-muted px-3 py-1 text-sm font-medium text-foreground"
            >
              {member.role}
            </span>
          ))}
        </div>
        <p className="truncate text-sm text-muted-foreground" title={memberNames}>
          {memberNames || "No members yet"}
        </p>
      </CardContent>
    </Card>
  );
}
