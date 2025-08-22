import type { JournalEntryType } from "./JournalEntryType";
import type { User } from "./UserType";

export type CommentType = {
  id: string; 
  content: string;
  author: User
  journalEntry: JournalEntryType
  createdAt: string;
  updatedAt: string;
};
