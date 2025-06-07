"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { roleTypeMap, type RoleType } from "@/types/user";

interface UserWelcomeProps {
  name: string;
  role: RoleType;
  onRoleToggle?: () => void;
}

export function UserWelcome({ name, role, onRoleToggle }: UserWelcomeProps) {
  // Get current time to display appropriate greeting
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{greeting}, {name}!</h2>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your {roleTypeMap[role].toLowerCase()} account today.
        </p>
      </div>
      
      {/* For demo purposes - role toggle button */}
      {onRoleToggle && (
        <Button 
          onClick={onRoleToggle}
          className="mt-4 md:mt-0"
          variant="outline"
        >
          Switch to {role === "client" ? "Freelancer" : "Client"} View
        </Button>
      )}
    </div>
  );
}