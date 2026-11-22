"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUp } from "../actions";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, {});

  return (
    <Card className="w-full max-w-md gap-7 rounded-2xl py-8 shadow-md">
      <CardHeader className="gap-2 px-8">
        <p className="text-sm font-medium text-primary">MealMate</p>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Sign up to start planning your meals.</CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <form action={action} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-first-name">
              First name
            </label>
            <Input
              autoComplete="given-name"
              autoFocus
              id="sign-up-first-name"
              name="firstName"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-last-name">
              Last name
            </label>
            <Input
              autoComplete="family-name"
              id="sign-up-last-name"
              name="lastName"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-email">
              Email
            </label>
            <Input
              autoComplete="email"
              id="sign-up-email"
              name="email"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-password">
              Password
            </label>
            <Input
              autoComplete="new-password"
              id="sign-up-password"
              minLength={8}
              name="password"
              type="password"
              required
            />
          </div>
          {state.message && (
            <p className="text-sm text-destructive" role="alert">
              {state.message}
            </p>
          )}
          <Button className="h-10 w-full" disabled={pending} type="submit">
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
