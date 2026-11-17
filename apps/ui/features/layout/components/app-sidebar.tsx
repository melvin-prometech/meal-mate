"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, House, Utensils, Users } from "lucide-react";
import { UserRole } from "@meal-mate/schemas";
import { SidebarUser } from "@/features/users/components/sidebar-user";
import { useUser } from "@/features/users/components/user-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navigation = [
  { label: "Recipes", href: "/", icon: BookOpen },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Households", href: "/households", icon: House },
];

export function AppSidebar({ households }: { households: ReactNode }) {
  const pathname = usePathname();
  const user = useUser();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="h-20 shrink-0 justify-center border-b border-sidebar-border px-6 py-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/"
          aria-label="MealMate home"
          className="flex min-w-0 items-center gap-3 text-sidebar-foreground"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Utensils className="size-6" strokeWidth={1.8} />
          </span>
          <span className="truncate text-xl leading-none font-medium tracking-tight group-data-[collapsible=icon]:hidden">
            MealMate
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 py-5">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={active}
                      className="h-11 rounded-lg px-3 text-[15px] font-medium text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Icon className="size-[19px]" strokeWidth={1.8} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-10 p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            My households
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {households}
          </SidebarGroupContent>
        </SidebarGroup>

        {user.role === UserRole.ADMIN ? (
          <SidebarGroup className="mt-auto p-0 pt-10">
            <SidebarGroupLabel className="mb-2 px-3 text-xs font-medium text-muted-foreground">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/users" />}
                    isActive={pathname === "/users"}
                    className="h-11 rounded-lg px-3 text-[15px] font-medium text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <Users className="size-[19px]" strokeWidth={1.8} />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarSeparator className="mx-0 w-full shrink-0" />
      <SidebarUser />
    </Sidebar>
  );
}
