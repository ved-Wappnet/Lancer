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
  Gavel,
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
    // Role-based Contracts route
    {
      title: "Contracts",
      href: "/dashboard/freelancer/contracts",
      icon: FileText,
      roles: ["freelancer"],
    },
    {
      title: "Contracts",
      href: "/dashboard/client/contracts",
      icon: FileText,
      roles: ["client"],
    },
    {
      title: "Contracts",
      href: "/dashboard/contracts",
      icon: Gavel,
      roles: ["admin"],
    },
    {
      title: "Milestones",
      href: "/dashboard/milestones",
      icon: CheckCircle,
      roles: ["client", "freelancer", "admin"],
    },
    // Role-based Bids route
    {
      title: "Bids",
      href: "/dashboard/freelancer/bids",
      icon: Gavel,
      roles: ["freelancer"],
    },
    {
      title: "Bids",
      href: "/dashboard/client/bids",
      icon: Gavel,
      roles: ["client"],
    },
    {
      title: "Bids",
      href: "/dashboard/bids",
      icon: Gavel,
      roles: ["admin"],
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