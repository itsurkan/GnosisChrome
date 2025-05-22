"use client";

import type { ChunkItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ChunkListItemProps {
  chunk: ChunkItem;
  isSelected: boolean;
  onSelectionChange: (chunkId: string, selected: boolean) => void;
}

export default function ChunkListItem({ chunk, isSelected, onSelectionChange }: ChunkListItemProps) {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
     if (typeof checked === 'boolean') {
      onSelectionChange(chunk.id, checked);
    }
  };
  
  const uniqueId = `chunk-${chunk.id}`;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id={uniqueId}
            checked={isSelected}
            onCheckedChange={handleCheckedChange}
            aria-labelledby={`${uniqueId}-label`}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
               <Label htmlFor={uniqueId} id={`${uniqueId}-label`} className="text-sm font-medium cursor-pointer">
                Source: {chunk.fileName}
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-accent hover:text-accent/80">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" /> Chunk from: {chunk.fileName}
                    </DialogTitle>
                    <DialogDescription>
                      Full text content of the selected chunk.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-md border bg-secondary/30 p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{chunk.text}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={chunk.text}>
              {chunk.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
