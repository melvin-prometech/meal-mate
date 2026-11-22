"use client";

import { SidebarFooter } from "@/components/ui/sidebar";
import { useUser } from "@/features/users/components/user-provider";
import { LogOut } from "lucide-react";
import { signOut } from "@/features/auth/actions";

export function SidebarUser() {
  const { firstName, lastName } = useUser();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <SidebarFooter className="min-h-20 p-4">
      <div className="flex min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-base font-semibold text-sidebar-accent-foreground"
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium group-data-[collapsible=icon]:hidden">
          {firstName} {lastName}
        </span>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Log out"
            title="Log out"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </form>
      </div>
    </SidebarFooter>
  );
}
