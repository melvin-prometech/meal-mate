"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { UserRole } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { submitUser } from "@/features/users/actions";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitUser, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus />Create user</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a user</DialogTitle>
          <DialogDescription>Add an account to MealMate and choose its access role.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium" htmlFor="user-first-name">
              First name
              <Input id="user-first-name" name="firstName" autoComplete="given-name" required minLength={2} />
            </label>
            <label className="block space-y-2 text-sm font-medium" htmlFor="user-last-name">
              Last name
              <Input id="user-last-name" name="lastName" autoComplete="family-name" required minLength={2} />
            </label>
          </div>
          <label className="block space-y-2 text-sm font-medium" htmlFor="user-email">
            Email
            <Input id="user-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label className="block space-y-2 text-sm font-medium" htmlFor="user-password">
            Password
            <Input id="user-password" name="password" type="password" autoComplete="new-password" required minLength={8} />
          </label>
          <label className="block space-y-2 text-sm font-medium" htmlFor="user-role">
            Role
            <select
              id="user-role"
              name="role"
              defaultValue={UserRole.USER}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </label>
          {state.message ? <p className="text-sm text-destructive" role="alert">{state.message}</p> : null}
          {state.success ? <p className="text-sm text-green-700" role="status">User created.</p> : null}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create user"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
