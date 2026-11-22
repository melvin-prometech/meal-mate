"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { submitHousehold } from "../actions";

export function CreateHouseholdDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitHousehold, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus />Create household</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a household</DialogTitle>
          <DialogDescription>Add a name for your household. Share the join code with people you want to invite.</DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5">
          <label className="block space-y-2 text-sm font-medium" htmlFor="household-name">
            Name
            <Input id="household-name" name="name" required minLength={2} maxLength={50} placeholder="e.g. The Smiths" />
          </label>
          {state.message && <p className="text-sm text-destructive" role="alert">{state.message}</p>}
          {state.joinCode && <p className="rounded-md border bg-muted p-3 text-sm">Household join code: <strong className="select-all font-mono">{state.joinCode}</strong></p>}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create household"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
