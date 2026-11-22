"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UserResponseDto } from "@meal-mate/schemas";

const UserContext = createContext<UserResponseDto | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserResponseDto;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): UserResponseDto {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("useUser must be used within an authenticated UserProvider.");
  }

  return user;
}
