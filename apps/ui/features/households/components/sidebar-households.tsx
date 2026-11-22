import { requireAuth } from "@/features/auth/auth";
import { getMyHouseholds } from "@/features/households/data/get-my-households";
import { SidebarHouseholdLinks } from "@/features/households/components/sidebar-household-links";

export async function SidebarHouseholds() {
  await requireAuth();
  const households = await getMyHouseholds();

  if (households.length === 0) {
    return <div className="px-3 py-2 text-sm text-muted-foreground">No households yet.</div>;
  }

  return <SidebarHouseholdLinks households={households.map(({ id, name }) => ({ id, name }))} />;
}
