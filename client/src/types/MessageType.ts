import type { User } from "./UserType";

export interface MessageBody {
  text?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  audioUrl?: string;
}

export interface Message {
  id: string; // transformed by applyIdTransform to string
  chat: string; // ObjectId reference to Chat
  author: User; // ObjectId reference to User
  body: MessageBody;
  deliveredTo: User[]; // array of User IDs
  readBy: User[]; // array of User IDs
  clientId?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
