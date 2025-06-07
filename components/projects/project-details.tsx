import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save, Share, Flag } from "lucide-react";
import Image from "next/image";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>We're looking for an experienced web designer to redesign our e-commerce website with a focus on improving user experience and conversion rates.</p>
            
            <h3>Project Goals:</h3>
            <ul>
              <li>Create a modern, responsive design that works across all devices</li>
              <li>Optimize the checkout process to reduce cart abandonment</li>
              <li>Improve product discovery and filtering</li>
              <li>Implement new branding guidelines</li>
              <li>Design a custom dashboard for loyalty program members</li>
            </ul>
            
            <h3>Requirements:</h3>
            <ul>
              <li>Experience with e-commerce design and optimization</li>
              <li>Proficiency in Figma for design deliverables</li>
              <li>Understanding of conversion rate optimization</li>
              <li>Knowledge of accessibility standards</li>
            </ul>
            
            <h3>Deliverables:</h3>
            <ul>
              <li>Complete design mockups for all key pages</li>
              <li>Interactive prototype for user testing</li>
              <li>Design system with components and style guide</li>
              <li>Design assets ready for development</li>
            </ul>
            
            <p>This project is expected to take approximately 4 weeks to complete. The successful candidate will work closely with our marketing and development teams.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </Button>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>Reference materials provided by the client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                PDF
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">brand_guidelines_2025.pdf</p>
                <p className="text-xs text-muted-foreground">2.4 MB • Added 2 days ago</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                ZIP
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">current_website_assets.zip</p>
                <p className="text-xs text-muted-foreground">8.7 MB • Added 2 days ago</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded-md overflow-hidden">
                <Image 
                  src="https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg" 
                  alt="Reference image"
                  width={60}
                  height={60}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">inspiration_design_1.jpg</p>
                <p className="text-xs text-muted-foreground">1.2 MB • Added 2 days ago</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded-md overflow-hidden">
                <Image 
                  src="https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg" 
                  alt="Reference image"
                  width={60}
                  height={60}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">inspiration_design_2.jpg</p>
                <p className="text-xs text-muted-foreground">0.9 MB • Added 2 days ago</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Skills Required</CardTitle>
          <CardDescription>Key skills for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">UI/UX Design</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">Figma</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">Responsive Design</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">E-commerce</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">Wireframing</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">Prototyping</div>
            <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">User Research</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}