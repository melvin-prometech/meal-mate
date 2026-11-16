import { HouseholdRole } from "@meal-mate/schemas";

export const householdRoleOptions = [
  { value: HouseholdRole.MEMBER, label: "Member" },
  { value: HouseholdRole.ADMIN, label: "Admin" },
] as const;

export function getHouseholdRoleLabel(role: HouseholdRole): string {
  return householdRoleOptions.find((option) => option.value === role)?.label ?? role;
}
