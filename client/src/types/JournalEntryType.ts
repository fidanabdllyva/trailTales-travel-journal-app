import type { User } from "./UserType";

export interface Like {
  userId: {
    id: string;
    username: string;
    profileImage: string;
  };
  id:string
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
  createdAt: string;
  updatedAt: string;
}
