import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save, Share, Flag } from "lucide-react";
import Image from "next/image";
import ReferenceImage from "@/public/images/Reference.jpeg"
import ReferenceImage2 from "@/public/images/ReferenceImages.jpeg"
import { useGetProjectByIdQuery } from "@/services/projectApi";
import Loader from "../ui/loader";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {


  const { data: project, isLoading,isFetching } = useGetProjectByIdQuery(projectId);

  if (isLoading || isFetching) {
    return <Loader/>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>{project?.description}</p>
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
      
      {/* <Card>
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
                  src={ReferenceImage}
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
                  src={ReferenceImage2} 
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
      </Card> */}
      
      <Card>
        <CardHeader>
          <CardTitle>Skills Required</CardTitle>
          <CardDescription>Key skills for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(project?.skillsRequired) && project.skillsRequired.length > 0 ? (
              project.skillsRequired.map((skill: string, idx: number) => (
                <div key={idx} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">{skill}</div>
              ))
            ) : (
              <span className="text-muted-foreground">No skills specified.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}