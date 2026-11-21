"use server";

import { SignUpSchema, UserResponseSchema } from "@meal-mate/schemas";
import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export type SignUpState = {
  message?: string;
};

export async function signUp(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const result = SignUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      message:
        "Enter your name, a valid email, and a password of at least 8 characters.",
    };
  }

  const response = await apiClient.fetch("/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data),
  });
  
  if (!response.ok) {
    return { message: "We couldn't create your account. Please try again." };
  }

  UserResponseSchema.parse(await response.json());
  redirect("/login");
}
