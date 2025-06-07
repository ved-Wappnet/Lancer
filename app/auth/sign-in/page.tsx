import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout 
      title="Sign in to your account" 
      description="Enter your email below to sign in to your account"
    >
      <AuthForm mode="sign-in" />
    </AuthLayout>
  );
}