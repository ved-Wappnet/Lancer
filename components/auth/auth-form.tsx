"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSignInMutation, useSignUpMutation } from "@/services/authApi";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";

// Form schema validation
const signInFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const signUpFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["client", "freelancer"], {
    required_error: "Please select a role",
  }),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;
type SignUpFormValues = z.infer<typeof signUpFormSchema>;

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  defaultRole?: "client" | "freelancer";
}

export function AuthForm({ mode, defaultRole }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // RTK Query mutations
  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();

  // Initialize form based on mode
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: defaultRole || "client",
    },
  });

  // Form submission handlers
  async function onSignInSubmit(data: SignInFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn(data).unwrap();
      dispatch(setUser(result.user));
      toast({
        title: "Signed in successfully!",
        description: "Redirecting to your dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err?.data?.error || err?.error || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignUpSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    try {
      const result = await signUp(data).unwrap();
      dispatch(setUser(result.user));
      toast({
        title: "Account created successfully!",
        description: "Redirecting to your dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      toast({
        title: "Sign up failed",
        description: err?.data?.error || err?.error || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (mode === "sign-in") {
    return (
      <div className="grid gap-6">
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(onSignInSubmit)}
            className="space-y-4"
          >
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isSignInLoading || isSignUpLoading}>
              {(isLoading || isSignInLoading || isSignUpLoading) ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-sm text-muted-foreground text-center">
          Do not have an account?
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
          className="space-y-4"
        >
          <FormField
            control={signUpForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I want to</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">Hire Freelancers</SelectItem>
                    <SelectItem value="freelancer">
                      Work as a Freelancer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading || isSignInLoading || isSignUpLoading}>
            {(isLoading || isSignInLoading || isSignUpLoading) ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </Form>
      <div className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
