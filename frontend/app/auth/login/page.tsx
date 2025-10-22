"use client";

import { Suspense } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setUsername } from "@/lib/store";

// Wrapper component that uses useSearchParams
function LoginFormWrapper() {
  const searchParams = useSearchParams();
  return <LoginForm searchParams={searchParams} />;
}

// Main login form component that receives searchParams as a prop
function LoginForm({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().optional(),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });      

      const result = await response.json();
      console.log('Result:', result);
      
      if(!result.success) {
        toast.error(`${result?.message || "Something went wrong"}`);
        return;
      }

      if (result.username) {
        dispatch(setUsername(result.username));
      }
      
      if (result.accessToken && result.username) {
        localStorage.setItem("username", result.username);
        localStorage.setItem(result.username, result.accessToken);
      }

      // Redirect to dashboard or return URL using the searchParams prop
      const redirectTo = searchParams?.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
      
    } catch (error) {
      toast.error(`${error || "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-0"
          onClick={() => router.push('/')}
        >
          <Icons.arrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icons.mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className={cn("pl-9")}
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icons.lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={cn("pl-9")}
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-full items-center pr-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  onCheckedChange={(checked) => 
                    form.setValue("rememberMe", Boolean(checked))
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium">
                  Remember me
                </Label>
              </div>
              
              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.github className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>
        </div>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Main page component that wraps everything in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginFormWrapper />
    </Suspense>
  );
}
