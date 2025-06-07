import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  actionText, 
  onAction,
  actionIcon = <Plus className="h-4 w-4 mr-2" />
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} className="whitespace-nowrap">
          {actionIcon}
          {actionText}
        </Button>
      )}
    </div>
  );
}
