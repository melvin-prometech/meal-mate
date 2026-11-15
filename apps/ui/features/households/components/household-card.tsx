"use client";

import { ArrowRight } from "lucide-react";
import type { HouseholdResponseDto } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/features/users/components/user-provider";

type HouseholdCardProps = {
  household: HouseholdResponseDto;
  onOpen: () => void;
};

export function HouseholdCard({ household, onOpen }: HouseholdCardProps) {
  const { id: userId } = useUser();
  const currentMember = household.members.find((member) => member.userId === userId);
  const memberNames = household.members
    .map((member) => member.firstName.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="grid-cols-[1fr_auto] items-center px-6 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="truncate text-xl">{household.name}</CardTitle>
        <CardAction className="row-span-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Open ${household.name}`}
            onClick={onOpen}
          >
            <ArrowRight aria-hidden="true" className="size-5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        {currentMember ? (
          <span className="w-fit rounded-md bg-muted px-3 py-1 text-sm font-medium text-foreground">
            {currentMember.role}
          </span>
        ) : null}
        <p className="truncate text-sm text-muted-foreground" title={memberNames}>
          {memberNames || "No members yet"}
        </p>
      </CardContent>
    </Card>
  );
}
