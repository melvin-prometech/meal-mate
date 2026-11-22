import type { ReactNode } from "react";
import { requireAuth } from "../auth";
import { UserProvider } from "@/features/users/components/user-provider";

export async function AuthGate({ children }: { children: ReactNode }) {
  const { user } = await requireAuth();

  return <UserProvider user={user}>{children}</UserProvider>;
}
