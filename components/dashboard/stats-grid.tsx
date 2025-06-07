"use client";

import { 
  Briefcase, DollarSign, BarChart3, Clock, 
  Users, CheckCircle, XCircle, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RoleType } from "@/types/user";

interface StatsGridProps {
  userRole: RoleType;
}

// Mock stats based on user role
const clientStats = [
  {
    title: "Active Projects",
    value: "5",
    icon: Briefcase,
    change: "+1 from last month",
    trend: "up"
  },
  {
    title: "Total Spent",
    value: "$12,450",
    icon: DollarSign,
    change: "+$2,100 from last month",
    trend: "up"
  },
  {
    title: "Hired Freelancers",
    value: "12",
    icon: Users,
    change: "+3 from last month",
    trend: "up"
  },
  {
    title: "Completed Projects",
    value: "24",
    icon: CheckCircle,
    change: "+2 from last month",
    trend: "up"
  },
];

const freelancerStats = [
  {
    title: "Active Contracts",
    value: "3",
    icon: Briefcase,
    change: "+1 from last month",
    trend: "up"
  },
  {
    title: "Earnings",
    value: "$8,350",
    icon: DollarSign,
    change: "+$1,200 from last month",
    trend: "up"
  },
  {
    title: "Proposals Sent",
    value: "18",
    icon: Clock,
    change: "+5 from last month",
    trend: "up"
  },
  {
    title: "Rating",
    value: "4.9/5",
    icon: Star,
    change: "Top 5% of freelancers",
    trend: "neutral"
  },
];

export function StatsGrid({ userRole }: StatsGridProps) {
  const stats = userRole === "client" ? clientStats : freelancerStats;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'} mt-1`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}