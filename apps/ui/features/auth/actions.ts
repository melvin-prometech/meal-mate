"use server";

import { SignInResponseSchema, SignInSchema } from "@meal-mate/schemas";
import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { clearAccessToken, saveAccessToken } from "./auth";

export type SignInState = {
  message?: string;
};

export async function signOut() {
  await clearAccessToken();
  redirect("/login");
}

export async function signIn(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const result = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) return { message: "Enter a valid email and password." };

  const response = await apiClient.fetch("/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data),
  });

  if (response.status === 401) return { message: "Email or password is incorrect." };
  if (!response.ok) throw new Error(`Failed to sign in (${response.status}).`);

  const data = SignInResponseSchema.parse(await response.json());
  await saveAccessToken(data.accessToken);
  redirect("/");
}
