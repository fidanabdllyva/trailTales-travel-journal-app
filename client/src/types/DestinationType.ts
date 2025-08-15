import type { TravelListType } from "./TravelListType";

export interface DestinationType {
    id: string; 
    name: string;
    country: string;
    datePlanned: Date;
    dateVisited: Date | null;
    status: 'wishlist' | 'planned' | 'completed' | 'cancelled';
    notes: string;
    images: {
        url: string;
        public_id: string;
    }[];
    list: TravelListType; 
    createdAt: Date;
    updatedAt: Date;
}
