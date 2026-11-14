import type { ReactNode } from "react";
import { requireAuth } from "../auth";

export async function AuthGate({ children }: { children: ReactNode }) {
  await requireAuth();
  return children;
}
