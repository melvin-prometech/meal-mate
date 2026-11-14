import { Suspense } from "react";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { LoginGate } from "@/features/auth/components/login-gate";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Checking sign in…</p>
        }
      >
        <LoginGate>
          <SignInForm />
        </LoginGate>
      </Suspense>
    </main>
  );
}
