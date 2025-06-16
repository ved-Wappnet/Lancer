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
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  // Toggle role in Redux for demo purposes
  const toggleRole = () => {
    if (!user) return;
    dispatch(setUser({
      ...user,
      role: user.role === "client" ? "freelancer" : "client"
    }));
  };

  return (
    <div className="space-y-8">
      <UserWelcome 
        name={user?.name}
        role={user?.role}
        onRoleToggle={toggleRole}
      />
      
      <StatsGrid userRole={user?.role} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <RecentProjects userRole={user?.role} />
          <RecentActivity />
        </div>
        <div className="md:col-span-4 space-y-6">
          <DashboardMessages />
        </div>
      </div>
    </div>
  );
}