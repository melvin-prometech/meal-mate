import { requireAuth } from "@/features/auth/auth";
import { getHouseholdsByUserId } from "@/features/households/data/get-households-by-user-id";
import { SidebarHouseholdLinks } from "@/features/households/components/sidebar-household-links";

export async function SidebarHouseholds() {
  const { user } = await requireAuth();
  const households = await getHouseholdsByUserId(user.id);

  if (households.length === 0) {
    return <div className="px-3 py-2 text-sm text-muted-foreground">No households yet.</div>;
  }

  return <SidebarHouseholdLinks households={households.map(({ id, name }) => ({ id, name }))} />;
}
