"use server";

import { CreateUserSchema, UpdateUserSchema, UserRole } from "@meal-mate/schemas";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/auth";
import { createUser } from "@/features/users/data/create-user";
import { updateUser } from "@/features/users/data/update-user";

export type CreateUserState = { message?: string; success?: boolean };

export async function submitUser(
  _previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const { user } = await requireAuth();
  if (user.role !== UserRole.ADMIN) return { message: "Only admins can create users." };

  const result = CreateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!result.success) {
    return { message: "Check the name, email, password, and role, then try again." };
  }

  try {
    await createUser(result.data);
    revalidatePath("/users");
    return { success: true };
  } catch {
    return { message: "Could not create the user. Check whether this email is already in use." };
  }
}

export async function submitUserUpdate(
  userId: string,
  _previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const { user } = await requireAuth();
  if (user.role !== UserRole.ADMIN) return { message: "Only admins can update users." };

  const rawPassword = formData.get("password");
  const result = UpdateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
    ...(typeof rawPassword === "string" && rawPassword.length > 0 ? { password: rawPassword } : {}),
  });

  if (!result.success) {
    return { message: "Check the name, email, role, and password (at least 8 characters), then try again." };
  }

  try {
    await updateUser(userId, result.data);
    revalidatePath("/users");
    return { success: true };
  } catch {
    return { message: "Could not update the user. Check whether this email is already in use." };
  }
}
