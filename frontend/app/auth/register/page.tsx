"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9-_]{3,23}$/;

const signupSchema = z.object({
  firstName: z.string().min(1, "First Name is required").max(255),
  lastName: z.string().min(1, "Last Name is required").max(255),
  username: z.string()
    .min(4, "Username must be at least 4 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(USERNAME_REGEX, "Letters, numbers, underscores, hyphens allowed"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirm: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = React.useState<{label: string, color: string}>({label: '', color: 'transparent'});

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      terms: false,
    },
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;

    const strengthMap = [
      { label: 'Weak', color: '#ff4444' },
      { label: 'Fair', color: '#ffbb33' },
      { label: 'Good', color: '#00C851' },
      { label: 'Strong', color: '#007E33' },
      { label: 'Very Strong', color: '#2E7D32' },
    ];

    return strengthMap[strength - 1] || { label: '', color: 'transparent' };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('password', e.target.value);
    setPasswordStrength(calculatePasswordStrength(e.target.value));
  };

  async function onSubmit(data: SignupFormValues) {
  setIsLoading(true);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log('Result:', result);

    if (!result.success) {
      toast.error(`${result?.message || "Something went wrong"}`);
      return;
    }

    toast.success(`${result?.message || "Your account has been created successfully."}`);
    form.reset();

  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Something went wrong");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-0"
          onClick={() => router.push('/')}
        >
          <Icons.arrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create an account
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    disabled={isLoading}
                    {...form.register("firstName")}
                  />
                  {form.formState.errors.firstName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    disabled={isLoading}
                    {...form.register("lastName")}
                  />
                  {form.formState.errors.lastName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icons.user className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="pl-9"
                    disabled={isLoading}
                    {...form.register("username")}
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

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
                    className="pl-9"
                    disabled={isLoading}
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icons.lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9"
                    disabled={isLoading}
                    {...form.register("password")}
                    onChange={handlePasswordChange}
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
                {passwordStrength.label && (
                  <div className="mt-1">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: '100%',
                        backgroundColor: passwordStrength.color,
                        opacity: form.watch('password') ? 1 : 0,
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icons.lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="passwordConfirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9"
                    disabled={isLoading}
                    {...form.register("passwordConfirm")}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-full items-center pr-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.passwordConfirm && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  onCheckedChange={(checked: any) => 
                    form.setValue("terms", Boolean(checked))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              {form.formState.errors.terms && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.terms.message}
                </p>
              )}

              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
