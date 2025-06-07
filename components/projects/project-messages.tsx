"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, Image, FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectMessagesProps {
  projectId: string;
}

// Mock messages data
const messages = [
  {
    id: "1",
    sender: {
      id: "c1",
      name: "John Doe",
      avatar: "/avatars/john.png",
      initials: "JD",
      role: "client",
    },
    content: "Hi Emma, I'm excited to work with you on this project. When can we schedule a kickoff call to discuss the requirements in more detail?",
    timestamp: "May 1, 2025 10:30 AM",
  },
  {
    id: "2",
    sender: {
      id: "f1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW",
      role: "freelancer",
    },
    content: "Hi John, thanks for choosing me for your project! I'm available for a call tomorrow between 10 AM and 2 PM EST. Would any time in that window work for you?",
    timestamp: "May 1, 2025 11:15 AM",
  },
  {
    id: "3",
    sender: {
      id: "c1",
      name: "John Doe",
      avatar: "/avatars/john.png",
      initials: "JD",
      role: "client",
    },
    content: "That works great. Let's do 11 AM EST. I'll send you a calendar invite with the Zoom link. Also, I've attached our current website analytics report that might be helpful for the redesign.",
    timestamp: "May 1, 2025 12:05 PM",
    attachments: [
      { name: "website_analytics_2025.pdf", size: "2.4 MB", type: "pdf" },
    ],
  },
  {
    id: "4",
    sender: {
      id: "f1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW",
      role: "freelancer",
    },
    content: "Perfect, I'll look for your invite. Thanks for sharing the analytics report - that will definitely help me understand the current user behavior. I'll review it before our call and come prepared with some initial questions.",
    timestamp: "May 1, 2025 12:30 PM",
  },
  {
    id: "5",
    sender: {
      id: "f1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW",
      role: "freelancer",
    },
    content: "I've started reviewing your current website and have put together some initial thoughts on areas for improvement. Here's a quick mockup of what the homepage could look like with a more streamlined approach.",
    timestamp: "May 2, 2025 3:15 PM",
    attachments: [
      { name: "initial_homepage_concept.jpg", size: "1.8 MB", type: "image" },
    ],
  },
];

export function ProjectMessages({ projectId }: ProjectMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an API
      console.log(`Sending message for project ${projectId}: ${newMessage}`);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.role === "freelancer" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.sender.role === "freelancer" ? "flex-row-reverse" : "flex-row"
              } gap-3`}
            >
              <Avatar className="h-9 w-9 mt-1">
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.sender.role === "freelancer"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      {message.sender.name}
                    </span>
                    <span
                      className={`text-xs ${
                        message.sender.role === "freelancer"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      } ml-2`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            message.sender.role === "freelancer"
                              ? "bg-primary-foreground/10"
                              : "bg-background"
                          }`}
                        >
                          {attachment.type === "pdf" ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <Image className="h-4 w-4" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                message.sender.role === "freelancer"
                                  ? "text-primary-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {attachment.name}
                            </p>
                            <p
                              className={`text-xs ${
                                message.sender.role === "freelancer"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {attachment.size}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 rounded-full ${
                              message.sender.role === "freelancer"
                                ? "hover:bg-primary-foreground/20"
                                : "hover:bg-muted"
                            }`}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Image className="mr-2 h-4 w-4" />
                <span>Upload Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Upload Document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}