import "server-only";

import type { UserResponseDto } from "@meal-mate/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticatedClient } from "@/lib/authenticated-client";

const ACCESS_TOKEN_COOKIE = "access_token";

export async function saveAccessToken(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

export async function clearAccessToken() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

export async function getAuth(): Promise<{
  accessToken: string;
  user: UserResponseDto;
} | null> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  const response = await authenticatedClient.fetch("/auth/me", {
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearAccessToken();
    return null;
  }

  if (!response.ok) throw new Error(`Failed to check sign-in (${response.status}).`);

  return {
    accessToken,
    user: (await response.json()) as UserResponseDto,
  };
}

export async function requireAuth() {
  const auth = await getAuth();
  if (!auth) redirect("/login");
  return auth;
}

export async function redirectIfAuthenticated() {
  if (await getAuth()) redirect("/");
}
