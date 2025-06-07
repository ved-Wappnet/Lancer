"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";

// Mock messages data
const recentMessages = [
  {
    id: "1",
    sender: {
      id: "u1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW"
    },
    message: "I've completed the first milestone for the e-commerce project. Can you review it?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    sender: {
      id: "u2",
      name: "David Chen",
      avatar: "/avatars/david.png",
      initials: "DC"
    },
    message: "Quick update on the mobile app - all features are on track for the demo next week.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    sender: {
      id: "u3",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
      initials: "SJ"
    },
    message: "I've sent over the updated brand guidelines. Let me know your thoughts!",
    time: "2 days ago",
    unread: false,
  },
];

export function DashboardMessages() {
  const [selectedMessage, setSelectedMessage] = useState(recentMessages[0]);
  const [reply, setReply] = useState("");

  const handleSendReply = () => {
    if (reply.trim()) {
      // In a real app, this would send the message to an API
      console.log(`Sending reply to ${selectedMessage.sender.name}: ${reply}`);
      setReply("");
    }
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Recent conversations</CardDescription>
        </div>
        <Link href="/messages">
          <Button variant="ghost" size="sm" className="text-xs">
            View all
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0">
        <div className="border-b">
          <div className="px-4 py-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} />
              <AvatarFallback>{selectedMessage.sender.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{selectedMessage.sender.name}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} />
                <AvatarFallback>{selectedMessage.sender.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">{selectedMessage.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedMessage.time}</p>
              </div>
            </div>
            
            {/* You could add more mock messages here for the conversation */}
          </div>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message..." 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <Button size="icon" onClick={handleSendReply} disabled={!reply.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}