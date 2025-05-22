// This file simulates API calls to localhost:8000
// In a real Chrome extension, these would be actual fetch requests.

import type { FileItem, ChunkItem } from '@/types';

const mockFiles: FileItem[] = [
  { id: 'file1', name: 'Project Proposal.docx', type: 'document' },
  { id: 'file2', name: 'Client Meeting Notes.pdf', type: 'document' },
  { id: 'file3', name: 'UI Mockups.png', type: 'image' },
  { id: 'file4', name: 'helper_functions.py', type: 'code' },
  { id: 'file5', name: 'Competitor Analysis.xlsx', type: 'unknown' },
];

const mockChunks: ChunkItem[] = [
  { id: 'chunk1', fileId: 'file1', fileName: 'Project Proposal.docx', text: 'The primary goal of this project is to enhance user engagement by 20%.' },
  { id: 'chunk2', fileId: 'file1', fileName: 'Project Proposal.docx', text: 'Key performance indicators (KPIs) will include daily active users and session duration.' },
  { id: 'chunk3', fileId: 'file2', fileName: 'Client Meeting Notes.pdf', text: 'Client emphasized the need for a simplified user interface and faster load times.' },
  { id: 'chunk4', fileId: 'file2', fileName: 'Client Meeting Notes.pdf', text: 'Follow-up meeting scheduled for next Tuesday to discuss a new feature.' },
  { id: 'chunk5', fileId: 'file4', fileName: 'helper_functions.py', text: 'def calculate_sum(a, b):\n  return a + b' },
];

export async function fetchFiles(authToken: string): Promise<FileItem[]> {
  console.log('Mock API: fetchFiles called with token:', authToken);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!authToken) {
    throw new Error('Authentication token is required.');
  }
  return [...mockFiles];
}

export async function searchFiles(authToken: string, query: string): Promise<ChunkItem[]> {
  console.log('Mock API: searchFiles called with token:', authToken, 'and query:', query);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  if (!authToken) {
    throw new Error('Authentication token is required.');
  }
  if (!query) {
    return [];
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockChunks.filter(chunk => 
    chunk.text.toLowerCase().includes(lowerCaseQuery) || 
    chunk.fileName.toLowerCase().includes(lowerCaseQuery)
  );
}
