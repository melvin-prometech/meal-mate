"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/features/users/components/user-provider";
import { submitHousehold } from "../actions";

export function CreateHouseholdDialog() {
  const { id: userId } = useUser();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitHousehold, {});

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus />Create household</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a household</DialogTitle>
          <DialogDescription>Add a name for your household.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <input type="hidden" name="userId" value={userId} />
          <label className="block space-y-2 text-sm font-medium" htmlFor="household-name">
            Name
            <Input id="household-name" name="name" required minLength={2} maxLength={50} placeholder="e.g. The Smiths" />
          </label>
          {state.message && <p className="text-sm text-destructive" role="alert">{state.message}</p>}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create household"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
