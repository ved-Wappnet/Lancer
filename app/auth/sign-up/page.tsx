"use client";

import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || undefined;
  
  return (
    <AuthLayout 
      title="Create an account" 
      description="Enter your details below to create your account"
    >
      <AuthForm mode="sign-up" defaultRole={role as "client" | "freelancer" | undefined} />
    </AuthLayout>
  );
}