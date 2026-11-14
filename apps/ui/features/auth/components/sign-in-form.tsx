"use client";

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
import { signIn } from "../actions";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {});

  return (
    <Card className="w-full max-w-md gap-7 rounded-2xl py-8 shadow-md">
      <CardHeader className="gap-2 px-8">
        <p className="text-sm font-medium text-primary">MealMate</p>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to plan your next meal.</CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <form action={action} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-in-email">
              Email
            </label>
            <Input
              autoComplete="email"
              autoFocus
              id="sign-in-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-in-password">
              Password
            </label>
            <Input
              autoComplete="current-password"
              id="sign-in-password"
              name="password"
              type="password"
            />
          </div>
          {state.message && <p className="text-sm text-destructive">{state.message}</p>}
          <Button className="h-10 w-full" disabled={pending} type="submit">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
