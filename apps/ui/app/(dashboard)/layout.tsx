import type { ReactNode } from "react";
import { AppSidebar } from "@/features/layout/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/features/auth/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
