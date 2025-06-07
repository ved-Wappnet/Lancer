"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Search, Send, Paperclip, Smile, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Mock conversations
  const conversations = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/avatars/01.png",
      lastMessage: "Hey, I've sent the design files for review.",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "2",
      name: "Sarah Williams",
      avatar: "/avatars/02.png",
      lastMessage: "Thanks for the update! Let's schedule a call.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: "3",
      name: "Michael Chen",
      avatar: "/avatars/03.png",
      lastMessage: "The project is on track for Friday's deadline.",
      time: "Yesterday",
      unread: 0,
    },
  ];

  return (
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b hover:bg-accent/50 cursor-pointer transition-colors ${
                activeChat === conversation.id ? "bg-accent" : ""
              }`}
              onClick={() => setActiveChat(conversation.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage 
                  src={conversations.find(c => c.id === activeChat)?.avatar} 
                  alt={conversations.find(c => c.id === activeChat)?.name} 
                />
                <AvatarFallback>
                  {conversations.find(c => c.id === activeChat)?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {conversations.find(c => c.id === activeChat)?.name}
                </h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[80%] md:max-w-[60%] bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                    <p>Hey there! How's the project coming along?</p>
                    <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] md:max-w-[60%] bg-primary text-primary-foreground rounded-lg p-3 shadow">
                    <p>Going well! I've completed the initial designs. Let me know what you think.</p>
                    <p className="text-xs text-primary-foreground/80 mt-1">10:32 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && message.trim()) {
                      // Handle send message
                      setMessage("");
                    }
                  }}
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a conversation or start a new one to begin messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
