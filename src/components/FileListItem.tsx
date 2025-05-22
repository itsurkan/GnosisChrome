"use client";

import type { FileItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, ImageIcon, Code2, FileQuestion } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileListItemProps {
  file: FileItem;
  isSelected: boolean;
  onSelectionChange: (fileId: string, selected: boolean) => void;
}

const getFileIcon = (type: FileItem['type']) => {
  switch (type) {
    case 'document':
      return <FileText className="h-5 w-5 text-primary" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-accent" />;
    case 'code':
      return <Code2 className="h-5 w-5 text-green-500" />; // Using a distinct color for code
    default:
      return <FileQuestion className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function FileListItem({ file, isSelected, onSelectionChange }: FileListItemProps) {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      onSelectionChange(file.id, checked);
    }
  };
  
  const uniqueId = `file-${file.id}`;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={uniqueId}
            checked={isSelected}
            onCheckedChange={handleCheckedChange}
            aria-labelledby={`${uniqueId}-label`}
          />
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {getFileIcon(file.type)}
            <Label htmlFor={uniqueId} id={`${uniqueId}-label`} className="truncate cursor-pointer text-sm font-medium">
              {file.name}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
