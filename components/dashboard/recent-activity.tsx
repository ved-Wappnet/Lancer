import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock activity data
const activities = [
  {
    id: "1",
    user: {
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW"
    },
    action: "completed",
    target: "Homepage UI Design milestone",
    project: "E-commerce Website Redesign",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "David Chen",
      avatar: "/avatars/david.png",
      initials: "DC"
    },
    action: "submitted",
    target: "a new milestone for review",
    project: "Mobile App Development",
    time: "Yesterday",
  },
  {
    id: "3",
    user: {
      name: "You",
      avatar: "/avatars/you.png",
      initials: "YO"
    },
    action: "approved",
    target: "payment for completed work",
    project: "Brand Identity Design",
    time: "2 days ago",
  },
  {
    id: "4",
    user: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
      initials: "SJ"
    },
    action: "sent",
    target: "a message about project timeline",
    project: "Brand Identity Design",
    time: "3 days ago",
  },
  {
    id: "5",
    user: {
      name: "You",
      avatar: "/avatars/you.png",
      initials: "YO"
    },
    action: "created",
    target: "a new project",
    project: "Content Marketing Strategy",
    time: "5 days ago",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions on your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span>{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>{" "}
                  <span className="text-muted-foreground">in</span>{" "}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}