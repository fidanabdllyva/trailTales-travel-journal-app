import moment from "moment";
import type { User } from "@/types/UserType";
import type { JournalEntryType } from "@/types/JournalEntryType";
import type { DestinationType } from "@/types/DestinationType";
import type { TravelListType } from "@/types/TravelListType";

export type ActivityType = "journal" | "destination" | "list";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string | Date;
  image?: string; // optional image URL
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

/**
 * Build activity feed for a user
 */
export const buildRecentActivity = (
  user: User,
  journalEntries: JournalEntryType[],
  destinations: DestinationType[],
  lists: TravelListType[]
): Activity[] => {
  const activities: Activity[] = [];

  // Journal entries authored by the user
  journalEntries
    .filter((entry) => entry.author.id === user.id)
    .forEach((entry) => {
      activities.push({
        id: entry.id,
        type: "journal",
        title: "Added new journal entry",
        description: entry.title,
        date: entry.createdAt,
        image: entry.photos?.[0]?.url, // first photo if exists
      });
    });

  // Completed destinations owned by the user
  destinations
    .filter((dest) => dest.status === "completed" && dest.list?.owner?.id === user.id)
    .forEach((dest) => {
      activities.push({
        id: dest.id,
        type: "destination",
        title: "Completed destination",
        description: `${dest.location.city}, ${dest.location.country}`,
        date: dest.dateVisited || dest.updatedAt,
       image: dest.image ?? undefined
      });
    });

  // Lists created by the user
  lists
    .filter((list) => list.owner?.id === user.id)
    .forEach((list) => {
      activities.push({
        id: list.id,
        type: "list",
        title: "Created new list",
        description: list.title,
        date: list.createdAt,
        image: list.coverImage, // if your list has a coverImage
      });
    });

  // Sort by most recent
  return activities.sort(
    (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
  );
};

/**
 * Build achievement badges for a user
 */
export const buildAchievements = (
  user: User,
  destinations: DestinationType[],
  lists: TravelListType[] = []
): Achievement[] => {
  // Ensure lists are only those owned by user
  const userLists = lists.filter((list) => list.owner?.id === user.id);

  // Only completed destinations owned by user
const completedDestinations = destinations.filter(
  (d) => d.status === "completed"
);


  return [
    {
      id: "a1",
      title: "First Journey",
      description: "Completed your first destination",
      unlocked: completedDestinations.length >= 1,
    },
    {
      id: "a2",
      title: "Explorer",
      description: "Visited 10 destinations",
      unlocked: completedDestinations.length >= 10,
    },
    {
      id: "a3",
      title: "Social Traveler",
      description: "Created 5 travel lists",
      unlocked: userLists.length >= 5,
    },
  ];
};

