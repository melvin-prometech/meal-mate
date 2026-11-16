import { Suspense, type ReactNode } from "react";
import { AppSidebar } from "@/features/layout/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SidebarHouseholds } from "@/features/households/components/sidebar-households";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
          Checking sign in…
        </div>
      }
    >
      <AuthGate>
        <SidebarProvider>
          <AppSidebar households={<SidebarHouseholds />} />
          <SidebarInset className="min-w-0 bg-background">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </AuthGate>
    </Suspense>
  );
}
