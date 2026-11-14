import type { ReactNode } from "react";
import { redirectIfAuthenticated } from "../auth";

export async function LoginGate({ children }: { children: ReactNode }) {
  await redirectIfAuthenticated();
  return children;
}
