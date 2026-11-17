import { Suspense } from "react";
import { LoginGate } from "@/features/auth/components/login-gate";
import { SignUpForm } from "@/features/auth/sign-up/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        <LoginGate>
          <SignUpForm />
        </LoginGate>
      </Suspense>
    </main>
  );
}
