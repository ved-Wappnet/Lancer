"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/projects",
      label: "Browse Projects",
      active: pathname === "/projects",
    },
    {
      href: "/freelancers",
      label: "Find Talent",
      active: pathname === "/freelancers",
    },
    {
      href: "/pricing",
      label: "Pricing",
      active: pathname === "/pricing",
    },
  ];

  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center space-x-2 mr-8">
        <Briefcase className="h-6 w-6" />
        <span className="font-bold text-xl">Lancer</span>
      </Link>
      <nav className="flex gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
