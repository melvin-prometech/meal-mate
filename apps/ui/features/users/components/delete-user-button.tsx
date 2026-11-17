"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/features/users/data/delete-user";
import { useUser } from "@/features/users/components/user-provider";

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const currentUser = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm(`Delete ${userName}? This action cannot be undone.`)) return;

    setIsDeleting(true);
    setError("");
    try {
      await deleteUser(userId);
      if (userId === currentUser.id) {
        router.push("/login");
      } else {
        router.refresh();
      }
    } catch {
      setError("Could not delete this user.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isDeleting}
        onClick={() => void handleDelete()}
      >
        <Trash2 aria-hidden="true" />
        {isDeleting ? "Deleting…" : "Delete"}
      </Button>
      {error ? <span role="alert" className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
