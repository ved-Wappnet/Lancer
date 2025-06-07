"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, Users, DollarSign, BarChart3, Clock, 
  Calendar, MessageSquare, CheckCircle, XCircle
} from "lucide-react";
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { DashboardMessages } from "@/components/dashboard/dashboard-messages";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { roleTypeMap, type RoleType } from "@/types/user";

export default function DashboardPage() {
  // In a real app, this would come from a user context or API
  const [userRole, setUserRole] = useState<RoleType>("client");
  
  // Simulate role toggle for demo purposes
  const toggleRole = () => {
    setUserRole(prev => prev === "client" ? "freelancer" : "client");
  };

  return (
    <div className="space-y-8">
      <UserWelcome 
        name="John Doe"
        role={userRole}
        onRoleToggle={toggleRole}
      />
      
      <StatsGrid userRole={userRole} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <RecentProjects userRole={userRole} />
          <RecentActivity />
        </div>
        <div className="md:col-span-4 space-y-6">
          <DashboardMessages />
        </div>
      </div>
    </div>
  );
}