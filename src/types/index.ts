export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'code' | 'unknown';
}

export interface ChunkItem {
  id: string;
  text: string;
  fileId: string;
  fileName: string; // For context when displaying chunk
}
