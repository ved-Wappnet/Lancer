"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contracts"
        description="Manage your active and past contracts"
        actionText="New Contract"
        onAction={() => console.log("Create new contract")}
      />

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          {activeTab === "active" && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No active contracts</h3>
              <p className="text-muted-foreground mt-2">
                When you have active contracts, they will appear here.
              </p>
            </div>
          )}
          {activeTab === "pending" && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No pending contracts</h3>
              <p className="text-muted-foreground mt-2">
                Pending contract requests will appear here.
              </p>
            </div>
          )}
          {activeTab === "completed" && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No completed contracts</h3>
              <p className="text-muted-foreground mt-2">
                Your completed contracts will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
