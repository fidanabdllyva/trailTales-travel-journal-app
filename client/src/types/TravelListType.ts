import type { DestinationType } from './DestinationType';
import type { User } from './UserType';

export interface TravelListType {
    id: string;
    title: string;
    description: string;
    tags: string[];
    isPublic: boolean;
    owner: User
    collaborators: User[];
    coverImage: string;
    public_id: string;
    destinations: DestinationType[];
    chat?: string;
    createdAt: Date;
    updatedAt: Date;
}
