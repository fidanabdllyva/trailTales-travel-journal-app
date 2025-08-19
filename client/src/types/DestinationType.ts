import type { TravelListType } from "./TravelListType";

export interface DestinationType {
    id: string;
    location: {
        country: string;
        city: string;
    };
    datePlanned: Date | string | null;
    dateVisited: Date | null | string;
    status: 'wishlist' | 'planned' | 'completed' | 'cancelled';
    notes: string;
    public_id: string;
    list: TravelListType;
    createdAt: Date;
    updatedAt: Date;
    rating: number | null
    listId?: string;
    image:File | string | null
}


export interface NewDestinationInput {
  location: { country: string; city: string };
  datePlanned: string; 
  dateVisited: string;
  status: "wishlist" | "planned" | "completed" | "cancelled";
  notes: string;
  image: File | null;
  public_id?: string;
  listId?: string;
  rating: number | null;
}
