"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync sidebar state from localStorage on initial load
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-16 relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          pathname={pathname} 
        />
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out w-full",
            sidebarOpen ? "lg:pl-72" : "lg:pl-16"
          )}
        >
          <main 
            className={cn(
              "min-h-[calc(100vh-4rem)] w-full",
              "px-4 py-6 md:px-6 lg:px-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}