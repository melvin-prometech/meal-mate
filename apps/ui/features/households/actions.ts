"use server";

import { CreateHouseholdSchema } from "@meal-mate/schemas";
import { revalidatePath } from "next/cache";
import { createHousehold } from "./data/create-household";

export type CreateHouseholdState = { message?: string; joinCode?: string; success?: boolean };

export async function submitHousehold(
  _previousState: CreateHouseholdState,
  formData: FormData,
): Promise<CreateHouseholdState> {
  const result = CreateHouseholdSchema.safeParse({ name: formData.get("name") });

  if (!result.success) {
    return { message: "Enter a household name and try again." };
  }

  try {
    const created = await createHousehold(result.data);
    revalidatePath("/households");
    return { success: true, joinCode: created.joinCode };
  } catch {
    return { message: "Could not create the household. Please try again." };
  }
}
