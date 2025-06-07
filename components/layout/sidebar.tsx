"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  X,
  Menu,
  LayoutDashboard,
  Briefcase,
  Clock,
  CreditCard,
  Users,
  FileText,
  PieChart,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pathname: string;
}

// Navigation items with client and freelancer specific items
const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["client", "freelancer", "admin"],
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: Briefcase,
    roles: ["client", "freelancer", "admin"],
  },
  {
    title: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
    roles: ["client", "freelancer", "admin"],
  },
  {
    title: "Milestones",
    href: "/dashboard/milestones",
    icon: CheckCircle,
    roles: ["client", "freelancer", "admin"],
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: ["client", "freelancer", "admin"],
  },
  {
    title: "Freelancers",
    href: "/dashboard/freelancers",
    icon: Users,
    roles: ["client", "admin"],
  },
  {
    title: "My Proposals",
    href: "/dashboard/proposals",
    icon: Clock,
    roles: ["freelancer"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: PieChart,
    roles: ["client", "freelancer", "admin"],
  },
];

export function Sidebar({ isOpen, setIsOpen, pathname }: SidebarProps) {
  const router = useRouter();
  // In a real app, you'd get the user role from context/API
  const userRole = "client";

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 bottom-0 left-0 z-30 border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
          isOpen
            ? "w-72 shadow-xl lg:translate-x-0"
            : "w-16 -translate-x-full lg:translate-x-0"
        )}
        aria-hidden={
          !isOpen && typeof window !== "undefined"
            ? window.innerWidth < 1024
            : false
        }
      >
        {/* Menu Toggle Button */}
        <div className="flex justify-between items-center p-4 border-b">
          {isOpen && <span className="font-semibold">Menu</span>}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", !isOpen && "mx-auto")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="flex flex-col gap-1 py-4">
            {navigationItems
              .filter((item) => item.roles.includes(userRole))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant={
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                          ? "secondary"
                          : "ghost"
                        : pathname.startsWith(item.href)
                        ? "secondary"
                        : "ghost"
                    }
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-200",
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                          ? "bg-secondary font-medium"
                          : "font-normal"
                        : pathname.startsWith(item.href)
                        ? "bg-secondary font-medium"
                        : "font-normal",
                      !isOpen && "px-2"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isOpen ? "mr-3" : "mx-auto"
                      )}
                    />
                    {isOpen && <span className="truncate">{item.title}</span>}
                  </Button>
                </Link>
              ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
