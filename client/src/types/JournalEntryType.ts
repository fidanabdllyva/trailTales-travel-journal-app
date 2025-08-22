import type { User } from "./UserType";

export interface Like {
  user: User;
  createdAt: Date;
}

export interface JournalEntryType {
  id: string;
  title: string;
  content: string;
  photos: { url: string; public_id: string }[];
  likes: Like[];
  comments: string[];
  location: {
    country: string;
    city: string;
  };
  author: User;
  public: boolean;
  createdAt:  string;
  updatedAt:  string;
}
