"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace("/page-not-found");
    }
    if (!user) {
      router.replace("/auth/sign-in");
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
