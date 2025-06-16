import {
  LayoutDashboard,
  Briefcase,
  Clock,
  CreditCard,
  Users,
  FileText,
  PieChart,
  CheckCircle,
  User,
} from "lucide-react";


export const navigationItems = [
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
      roles: ["client"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["client", "freelancer", "admin"],
    },
  ];