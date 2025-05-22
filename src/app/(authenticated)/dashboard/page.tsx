"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchFiles, searchFiles as apiSearchFiles } from '@/lib/api';
import { injectAiQuery, type InjectAiQueryOutput } from '@/ai/flows/inject-ai-query';
import type { FileItem, ChunkItem } from '@/types';
import FileListItem from '@/components/FileListItem';
import ChunkListItem from '@/components/ChunkListItem';
import { Search, Sparkles, Copy, Info, UploadCloud, ListFilter, FileText, Brain } from 'lucide-react';

export default function DashboardPage() {
  const { token } = useAuth();
  const { toast } = useToast();

  // Files state
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());

  // Search and Chunks state
  const [searchQuery, setSearchQuery] = useState('');
  const [chunks, setChunks] = useState<ChunkItem[]>([]);
  const [isLoadingChunks, setIsLoadingChunks] = useState(false);
  const [selectedChunkIds, setSelectedChunkIds] = useState<Set<string>>(new Set());
  
  // AI Analysis state
  const [currentUserQuery, setCurrentUserQuery] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<InjectAiQueryOutput | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Text Attachment state
  const [textToAttach, setTextToAttach] = useState('');

  // Initial file fetch
  useEffect(() => {
    if (token) {
      setIsLoadingFiles(true);
      fetchFiles(token)
        .then(setFiles)
        .catch(err => toast({ title: "Error fetching files", description: err.message, variant: "destructive" }))
        .finally(() => setIsLoadingFiles(false));
    }
  }, [token, toast]);

  const handleSearchFiles = async () => {
    if (!token || !searchQuery.trim()) {
      toast({ title: "Search query empty", description: "Please enter a term to search for.", variant: "default" });
      setChunks([]); // Clear chunks if search query is empty
      return;
    }
    setIsLoadingChunks(true);
    setAiAnalysisResult(null); // Reset AI analysis when new search is performed
    setSelectedChunkIds(new Set()); // Reset selected chunks
    setTextToAttach(''); // Reset text to attach
    try {
      const results = await apiSearchFiles(token, searchQuery);
      setChunks(results);
      if (results.length === 0) {
        toast({ title: "No results", description: `No chunks found for "${searchQuery}".`, variant: "default" });
      }
    } catch (err: any) {
      toast({ title: "Error searching files", description: err.message, variant: "destructive" });
    } finally {
      setIsLoadingChunks(false);
    }
  };

  const handleFileSelectionChange = (fileId: string, selected: boolean) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (selected) newSet.add(fileId);
      else newSet.delete(fileId);
      return newSet;
    });
    // This basic example doesn't use selected files directly for search, but it's here for potential future use.
    // For now, search uses a global query. If search should be filtered by selected files, this logic needs to be added.
  };
  
  const handleChunkSelectionChange = (chunkId: string, selected: boolean) => {
    setSelectedChunkIds(prev => {
      const newSet = new Set(prev);
      if (selected) newSet.add(chunkId);
      else newSet.delete(chunkId);
      return newSet;
    });
    setAiAnalysisResult(null); // Reset AI analysis if chunk selection changes
    setTextToAttach(''); // Reset text to attach
  };

  const selectedChunkObjects = useMemo(() => {
    return chunks.filter(chunk => selectedChunkIds.has(chunk.id));
  }, [chunks, selectedChunkIds]);

  const handleAnalyzeWithAI = async () => {
    if (!currentUserQuery.trim() || selectedChunkObjects.length === 0) {
      toast({ title: "Missing input", description: "Please enter your query and select at least one chunk.", variant: "default" });
      return;
    }
    setIsLoadingAI(true);
    setAiAnalysisResult(null);
    setTextToAttach('');
    try {
      const documentChunksText = selectedChunkObjects.map(chunk => chunk.text);
      const result = await injectAiQuery({ query: currentUserQuery, documentChunks: documentChunksText });
      setAiAnalysisResult(result);
      toast({ title: "AI Analysis Complete", description: result.reason, variant: "default" });
    } catch (err: any) {
      toast({ title: "AI Analysis Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAttachToChat = () => {
    if (!aiAnalysisResult?.shouldInject || selectedChunkObjects.length === 0) return;
    
    const chunksText = selectedChunkObjects.map(chunk => `Relevant Document Snippet from "${chunk.fileName}":\n${chunk.text}`).join("\n\n---\n\n");
    const combinedText = `${currentUserQuery}\n\n${chunksText}`;
    setTextToAttach(combinedText);
  };

  const handleCopyToClipboard = () => {
    if (!textToAttach) return;
    navigator.clipboard.writeText(textToAttach)
      .then(() => toast({ title: "Copied to clipboard!", variant: "default" }))
      .catch(err => toast({ title: "Failed to copy", description: err.message, variant: "destructive" }));
  };
  
  const renderFileSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <div key={`file-skeleton-${i}`} className="p-3 border rounded-md bg-card">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    ))
  );

  const renderChunkSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <div key={`chunk-skeleton-${i}`} className="p-3 border rounded-md bg-card">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-5 w-5 rounded mt-1" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl"><UploadCloud className="mr-3 h-7 w-7 text-primary" />Access Your Files</CardTitle>
          <CardDescription>Search your local documents and inject relevant information into your chats.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search file contents or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchFiles()}
              className="flex-grow"
              aria-label="Search files"
            />
            <Button onClick={handleSearchFiles} disabled={isLoadingChunks || !searchQuery.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          {/* Display Files (Optional, current UX focuses on search results/chunks) */}
          {/* If you want to list files initially:
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center"><ListFilter className="mr-2 h-4 w-4" />Available Files (select to filter search - TBD)</h3>
            {isLoadingFiles ? renderFileSkeletons() : files.length > 0 ? (
              <ScrollArea className="h-40 rounded-md border p-2">
                <div className="space-y-2">
                  {files.map(file => (
                    <FileListItem key={file.id} file={file} isSelected={selectedFileIds.has(file.id)} onSelectionChange={handleFileSelectionChange} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No files loaded or found.</p>
            )}
          </div>
          <Separator />
          */}
        </CardContent>
      </Card>

      {(isLoadingChunks || chunks.length > 0) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><FileText className="mr-3 h-6 w-6 text-primary" />Search Results (Select Chunks)</CardTitle>
            <CardDescription>Relevant text snippets found. Select chunks to analyze with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingChunks ? renderChunkSkeletons() : chunks.length > 0 ? (
              <ScrollArea className="h-64 rounded-md border p-2">
                <div className="space-y-2">
                  {chunks.map(chunk => (
                    <ChunkListItem key={chunk.id} chunk={chunk} isSelected={selectedChunkIds.has(chunk.id)} onSelectionChange={handleChunkSelectionChange} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No chunks to display. Perform a search to see results.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl"><Brain className="mr-3 h-6 w-6 text-primary" />AI Context Injection</CardTitle>
          <CardDescription>Enter your current chat query and analyze it with selected document chunks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentUserQuery" className="font-medium">Your Current Chat Query</Label>
            <Textarea
              id="currentUserQuery"
              placeholder="e.g., What were the key takeaways from the last client meeting?"
              value={currentUserQuery}
              onChange={(e) => setCurrentUserQuery(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          <Button onClick={handleAnalyzeWithAI} disabled={isLoadingAI || !currentUserQuery.trim() || selectedChunkObjects.length === 0} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" /> {isLoadingAI ? "Analyzing..." : "Analyze with AI"}
          </Button>

          {aiAnalysisResult && (
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={`font-semibold ${aiAnalysisResult.shouldInject ? 'text-green-600' : 'text-red-600'}`}>
                  {aiAnalysisResult.shouldInject ? "Inject Documents: YES" : "Inject Documents: NO"}
                </p>
                <p className="text-sm text-muted-foreground">Reason: {aiAnalysisResult.reason}</p>
                {aiAnalysisResult.shouldInject && (
                  <Button onClick={handleAttachToChat} className="mt-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Prepare Text for Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {textToAttach && (
            <div className="space-y-2 pt-4">
              <Label htmlFor="textToAttach" className="font-medium">Prepared Text for Chat</Label>
              <Textarea id="textToAttach" value={textToAttach} readOnly rows={8} className="bg-muted/50" />
              <Button onClick={handleCopyToClipboard} variant="outline" className="w-full">
                <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
       <div className="py-6 text-center text-xs text-muted-foreground">
        <p>AIAssist - Streamlining your research and chat workflow.</p>
        <p>This is a Next.js simulation. For Chrome Extension functionality, further development is needed.</p>
      </div>
    </div>
  );
}
