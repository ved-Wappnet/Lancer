"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, CreditCard, ArrowUpDown, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'credit' | 'debit';
  recipient?: string;
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment; direction: 'asc' | 'desc' } | null>(null);

  // Mock payments data
  const payments: Payment[] = [
    {
      id: "PAY-001",
      date: "2025-06-01",
      description: "Website Redesign Project",
      amount: 2500.00,
      status: "completed",
      type: "debit",
      recipient: "John Smith"
    },
    {
      id: "PAY-002",
      date: "2025-05-28",
      description: "E-commerce Development",
      amount: 3500.00,
      status: "pending",
      type: "credit"
    },
    {
      id: "PAY-003",
      date: "2025-05-25",
      description: "UI/UX Design Package",
      amount: 1800.00,
      status: "completed",
      type: "debit",
      recipient: "Sarah Johnson"
    },
    {
      id: "PAY-004",
      date: "2025-05-20",
      description: "Subscription Renewal",
      amount: 99.00,
      status: "completed",
      type: "debit"
    },
    {
      id: "PAY-005",
      date: "2025-05-15",
      description: "Mobile App Development",
      amount: 4200.00,
      status: "failed",
      type: "credit"
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Payment) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalEarned = payments
    .filter(p => p.type === 'credit' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage your payments and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Request Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {payments.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
              <TabsTrigger value="failed" className="text-xs">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('date')}>
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => requestSort('amount')}>
                  <div className="flex items-center justify-end">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {payment.description}
                      {payment.recipient && (
                        <p className="text-xs text-muted-foreground">
                          {payment.type === 'debit' ? 'To: ' : 'From: '}
                          {payment.recipient}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      payment.type === 'credit' ? 'text-green-600 dark:text-green-400' : ''
                    }`}>
                      {payment.type === 'credit' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.type === 'credit' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {payment.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="border-t px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{Math.min(10, sortedPayments.length)}</span> of{' '}
            <span className="font-medium">{sortedPayments.length}</span> results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
