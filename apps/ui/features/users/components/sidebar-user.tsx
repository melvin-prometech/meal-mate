"use client";

import { SidebarFooter } from "@/components/ui/sidebar";
import { useUser } from "@/features/users/components/user-provider";

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
        <span className="truncate text-[15px] font-medium group-data-[collapsible=icon]:hidden">
          {firstName} {lastName}
        </span>
      </div>
    </SidebarFooter>
  );
}
