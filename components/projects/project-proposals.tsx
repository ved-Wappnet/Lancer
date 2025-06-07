"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Star, MessageSquare, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

interface ProjectProposalsProps {
  projectId: string;
}

// Mock proposals data
const proposals = [
  {
    id: "1",
    freelancer: {
      id: "f1",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      initials: "EW",
      rating: 4.9,
      completedProjects: 47,
      location: "United States",
      hourlyRate: "$45/hr",
    },
    bid: "$4,200",
    deliveryTime: "3 weeks",
    coverLetter: "I specialize in e-commerce design with a focus on conversion optimization. I've worked with over 20 e-commerce brands to improve their user experience and increase sales. My approach combines data-driven design decisions with beautiful aesthetics to create websites that not only look great but perform well too.",
    status: "shortlisted",
    submittedAt: "2 days ago",
  },
  {
    id: "2",
    freelancer: {
      id: "f2",
      name: "David Chen",
      avatar: "/avatars/david.png",
      initials: "DC",
      rating: 4.7,
      completedProjects: 32,
      location: "Canada",
      hourlyRate: "$40/hr",
    },
    bid: "$4,500",
    deliveryTime: "4 weeks",
    coverLetter: "With over 8 years of experience in UI/UX design for e-commerce platforms, I've helped businesses increase their conversion rates by an average of 35%. I specialize in creating intuitive user experiences that guide customers smoothly through the purchasing funnel.",
    status: "shortlisted",
    submittedAt: "3 days ago",
  },
  {
    id: "3",
    freelancer: {
      id: "f3",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
      initials: "SJ",
      rating: 4.8,
      completedProjects: 28,
      location: "United Kingdom",
      hourlyRate: "$50/hr",
    },
    bid: "$4,800",
    deliveryTime: "3 weeks",
    coverLetter: "I'm a UX designer with a background in e-commerce optimization. My design philosophy centers around creating seamless user journeys that drive conversions while maintaining brand consistency.",
    status: "pending",
    submittedAt: "4 days ago",
  },
];

export function ProjectProposals({ projectId }: ProjectProposalsProps) {
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Submitted Proposals</CardTitle>
              <CardDescription>12 freelancers have submitted proposals for this project</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort by: Recent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div 
                key={proposal.id}
                className="rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={proposal.freelancer.avatar} alt={proposal.freelancer.name} />
                      <AvatarFallback>{proposal.freelancer.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h4 className="font-semibold">{proposal.freelancer.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm">{proposal.freelancer.rating}</span>
                        </div>
                        {proposal.status === "shortlisted" && (
                          <Badge variant="secondary">Shortlisted</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        UX/UI Designer • {proposal.freelancer.location}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="mr-1 h-4 w-4" />
                          Bid: {proposal.bid}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          Delivery: {proposal.deliveryTime}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm line-clamp-2">{proposal.coverLetter}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:ml-auto flex flex-wrap items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProposal(proposal)}>
                          View Proposal
                        </Button>
                      </DialogTrigger>
                      {selectedProposal && (
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Proposal from {selectedProposal.freelancer.name}</DialogTitle>
                            <DialogDescription>
                              Submitted {selectedProposal.submittedAt}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedProposal.freelancer.avatar} alt={selectedProposal.freelancer.name} />
                                <AvatarFallback>{selectedProposal.freelancer.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{selectedProposal.freelancer.name}</h4>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="ml-1 text-sm">{selectedProposal.freelancer.rating}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  UX/UI Designer • {selectedProposal.freelancer.location}
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Hourly Rate:</span>{" "}
                                    <span>{selectedProposal.freelancer.hourlyRate}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Completed Projects:</span>{" "}
                                    <span>{selectedProposal.freelancer.completedProjects}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/50">
                              <div>
                                <p className="text-sm text-muted-foreground">Bid Amount</p>
                                <p className="font-semibold">{selectedProposal.bid}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Delivery Time</p>
                                <p className="font-semibold">{selectedProposal.deliveryTime}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                              <p className="text-sm">{selectedProposal.coverLetter}</p>
                            </div>
                            
                            {/* Add more proposal details as needed */}
                          </div>
                          <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              className="sm:w-full"
                              onClick={() => {
                                /* Open chat with freelancer */
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </Button>
                            <Button
                              className="sm:w-full"
                              onClick={() => {
                                /* Shortlist or hire */
                              }}
                            >
                              {selectedProposal.status === "shortlisted" ? "Hire Freelancer" : "Shortlist"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Message</span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {proposal.status !== "shortlisted" && (
                          <DropdownMenuItem>Shortlist</DropdownMenuItem>
                        )}
                        {proposal.status === "shortlisted" && (
                          <DropdownMenuItem>Remove from Shortlist</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Download Attachments</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Decline</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}