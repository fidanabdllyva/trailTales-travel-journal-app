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
    image: {
        url: string;
        public_id: string;
    };
    list: TravelListType;
    createdAt: Date;
    updatedAt: Date;
}
