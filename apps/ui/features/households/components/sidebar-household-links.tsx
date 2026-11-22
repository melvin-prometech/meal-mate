"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarHouseholdLinks({
  households,
}: {
  households: Array<{ id: string; name: string }>;
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-1">
      {households.map((household) => {
        const href = `/households/${encodeURIComponent(household.id)}`;

        return (
          <SidebarMenuItem key={household.id}>
            <SidebarMenuButton
              render={<Link href={href} />}
              isActive={pathname === href || pathname.startsWith(`${href}/`)}
              className="h-10 rounded-lg px-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
              tooltip={household.name}
            >
              <House className="size-[18px]" strokeWidth={1.8} />
              <span className="truncate">{household.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
