"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
  ChevronDown,
  RefreshCw,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, subMonths, subYears, isSameDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// Mock data generation functions
const generateDailyData = (days = 30) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      date,
      value: Math.floor(Math.random() * 100) + 20,
      value2: Math.floor(Math.random() * 80) + 10,
    };
  });
};

const generateMonthlyData = (months = 12) => {
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), months - i - 1);
    return {
      date,
      value: Math.floor(Math.random() * 2000) + 500,
      value2: Math.floor(Math.random() * 1500) + 300,
    };
  });
};

const generateYearlyData = (years = 5) => {
  return Array.from({ length: years }, (_, i) => {
    const date = subYears(new Date(), years - i - 1);
    return {
      date,
      value: Math.floor(Math.random() * 20000) + 5000,
      value2: Math.floor(Math.random() * 15000) + 3000,
    };
  });
};

const generatePieData = () => {
  return [
    { name: "Web Development", value: 35, color: "#3b82f6" },
    { name: "Mobile App", value: 25, color: "#8b5cf6" },
    { name: "UI/UX Design", value: 20, color: "#ec4899" },
    { name: "Digital Marketing", value: 15, color: "#10b981" },
    { name: "Content Writing", value: 5, color: "#f59e0b" },
  ];
};

const generateStats = () => ({
  totalEarnings: {
    current: 12450,
    change: 12.5,
    trend: "up",
  },
  activeProjects: {
    current: 8,
    change: 2,
    trend: "up",
  },
  proposalsSent: {
    current: 24,
    change: -3,
    trend: "down",
  },
  completionRate: {
    current: 92,
    change: 5,
    trend: "up",
  },
});

const generateRecentActivity = () => [
  {
    id: 1,
    type: "payment",
    title: "Payment Received",
    description: "$1,250 for E-commerce Website Project",
    date: new Date(),
    amount: 1250,
    icon: <DollarSign className="h-4 w-4 text-green-500" />,
  },
  {
    id: 2,
    type: "project",
    title: "New Project Started",
    description: "Mobile App Development for Client X",
    date: subDays(new Date(), 1),
    icon: <Briefcase className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 3,
    type: "proposal",
    title: "Proposal Accepted",
    description: "Your proposal for UI/UX Design was accepted",
    date: subDays(new Date(), 2),
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  },
  {
    id: 4,
    type: "proposal",
    title: "Proposal Declined",
    description: "Your proposal for Web Development was not selected",
    date: subDays(new Date(), 3),
    icon: <XCircle className="h-4 w-4 text-red-500" />,
  },
  {
    id: 5,
    type: "milestone",
    title: "Milestone Approved",
    description: "Milestone #2 for Project Y was approved",
    date: subDays(new Date(), 4),
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  },
];

type TimeRange = "7d" | "30d" | "90d" | "12m" | "5y";

const timeRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "5y", label: "Last 5 years" },
];

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  change?: number;
  trend?: "up" | "down";
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <div className="h-5 w-5 text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && trend && (
        <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}% from last period
        </p>
      )}
    </CardContent>
  </Card>
);

const ChartCard = ({ 
  title, 
  description, 
  children,
  className = ""
}: { 
  title: string; 
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && (
        <CardDescription>{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="pb-6">
      {children}
    </CardContent>
  </Card>
);

const ActivityItem = ({ item }: { item: any }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{item.title}</h4>
          <span className="text-xs text-muted-foreground">
            {formatDate(item.date)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        {item.amount && (
          <div className="mt-1 text-sm font-medium">
            ${item.amount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate data based on selected time range
  const getChartData = () => {
    switch (timeRange) {
      case "7d":
      case "30d":
      case "90d":
        return generateDailyData(timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90);
      case "12m":
        return generateMonthlyData(12);
      case "5y":
        return generateYearlyData(5);
      default:
        return generateDailyData(30);
    }
  };
  
  const chartData = getChartData();
  const pieData = generatePieData();
  const stats = generateStats();
  const recentActivity = generateRecentActivity();
  
  const formatDate = (date: Date) => {
    if (timeRange === "5y") {
      return format(date, 'yyyy');
    } else if (timeRange === "12m") {
      return format(date, 'MMM yyyy');
    } else {
      return format(date, 'MMM d');
    }
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Analytics"
          description="Track your performance and earnings"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Earnings"
              value={`$${stats.totalEarnings.current.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4" />}
              change={stats.totalEarnings.change}
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects.current}
              icon={<Briefcase className="h-4 w-4" />}
              change={stats.activeProjects.change}
            />
            <StatCard
              title="Proposals Sent"
              value={stats.proposalsSent.current}
              icon={<FileText className="h-4 w-4" />}
              change={stats.proposalsSent.change}
            />
            <StatCard
              title="Completion Rate"
              value={`${stats.completionRate.current}%`}
              icon={<CheckCircle2 className="h-4 w-4" />}
              change={stats.completionRate.change}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChartCard 
              title="Earnings Overview" 
              description={`Your earnings over the last ${timeRangeOptions.find(opt => opt.value === timeRange)?.label.toLowerCase()}`}
              className="lg:col-span-2"
            >
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/50 rounded-md">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Earnings chart will be displayed here</span>
              </div>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>Start: {formatDate(chartData[0]?.date || new Date())}</span>
                <span>End: {formatDate(chartData[chartData.length - 1]?.date || new Date())}</span>
              </div>
            </ChartCard>

            <ChartCard title="Earnings by Category">
              <div className="h-[300px] w-full flex flex-col items-center justify-center bg-muted/50 rounded-md">
                <PieChart className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-muted-foreground text-sm">Earnings by category</span>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Recent Activity">
              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View all activity
              </Button>
            </ChartCard>

            <ChartCard title="Top Clients">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/0${i}.png`} alt="Client" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Client {i}</p>
                        <p className="text-sm text-muted-foreground">${(Math.random() * 10000).toFixed(2)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View all clients
              </Button>
            </ChartCard>
          </div>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>Detailed breakdown of your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center bg-muted/50 rounded-md">
                <LineChart className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Earnings details will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Your project metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center bg-muted/50 rounded-md">
                <Briefcase className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Project analytics will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proposals</CardTitle>
              <CardDescription>Your proposal performance and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center bg-muted/50 rounded-md">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Proposal analytics will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
