import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <SignInForm />
    </main>
  );
}
