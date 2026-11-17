"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { UserRole, type UserResponseDto } from "@meal-mate/schemas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { submitUserUpdate } from "@/features/users/actions";

export function EditUserDialog({ user }: { user: UserResponseDto }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitUserUpdate.bind(null, user.id), {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="icon" aria-label={`Edit ${user.firstName} ${user.lastName}`} title="Edit user"><Pencil /></Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update this account’s details and access role.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium" htmlFor={`edit-first-${user.id}`}>
              First name
              <Input id={`edit-first-${user.id}`} name="firstName" defaultValue={user.firstName} required minLength={2} />
            </label>
            <label className="block space-y-2 text-sm font-medium" htmlFor={`edit-last-${user.id}`}>
              Last name
              <Input id={`edit-last-${user.id}`} name="lastName" defaultValue={user.lastName} required minLength={2} />
            </label>
          </div>
          <label className="block space-y-2 text-sm font-medium" htmlFor={`edit-email-${user.id}`}>
            Email
            <Input id={`edit-email-${user.id}`} name="email" type="email" defaultValue={user.email} required />
          </label>
          <label className="block space-y-2 text-sm font-medium" htmlFor={`edit-role-${user.id}`}>
            Role
            <select
              id={`edit-role-${user.id}`}
              name="role"
              defaultValue={user.role}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium" htmlFor={`edit-password-${user.id}`}>
            Set new password <span className="font-normal text-muted-foreground">(optional)</span>
            <Input id={`edit-password-${user.id}`} name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Leave blank to keep current password" />
          </label>
          {state.message ? <p className="text-sm text-destructive" role="alert">{state.message}</p> : null}
          {state.success ? <p className="text-sm text-green-700" role="status">User updated.</p> : null}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
