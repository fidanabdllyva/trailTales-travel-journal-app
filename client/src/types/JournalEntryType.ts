import type { DestinationType } from "./DestinationType";
import type { User } from "./UserType";

export interface Like {
  userId: string;
  createdAt: Date;
}

export interface JournalEntryType {
  id: string;
  title: string;
  content: string;
  photos: { url: string; public_id: string }[];
  likes: Like[];
  comments: string[]; // array of comment IDs
  destination: DestinationType; 
  author: User;  
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}
