import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin} from "lucide-react";
import type { TravelListType } from "@/types/TravelListType";
import { Link } from "react-router-dom";

interface ExploreListCardProps {
    list: TravelListType;
}

const ExploreListCard: React.FC<ExploreListCardProps> = ({ list }) => {
    const { id,title, coverImage, isPublic, description, destinations, tags, owner, createdAt } = list;


    return (
        <Card className="w-full max-w-sm overflow-hidden bg-white shadow">
            {/* Image Section */}
            <div className="relative h-50 bg-gray-100 flex items-center justify-center">
                <div className="w-full h-50">

                    <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-white rounded-full shadow">
                    {isPublic ? "Public" : "Private"}
                </div>
            </div>

            <CardContent className="space-y-2">


                {/* Title & Description */}
                <Link to={`/travel-list/${id}`}>
                
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                </Link>
                <p className="text-sm text-gray-600">{description}</p>

                {/* Destinations */}
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin size={15} />
                    <span className="font-medium">{destinations.length}</span>
                    {destinations.length > 1 ? "destinations" : "destination"}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                        </Badge>
                    ))}
                    {tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{tags.length - 3}
                        </Badge>
                    )}
                </div>


                {/* Author & Date */}
                <p className="text-xs text-gray-400 py-4 mb-3">
                    <div className="flex items-center gap-1">

                        <img
                            src={owner.profileImage}
                            alt={owner.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                        />

                        <span>by {list.owner?.fullName || "Unknown"}</span>
                        · {new Date(createdAt).toLocaleDateString()}
                    </div>
                </p>
            </CardContent>
        </Card>
    );
};

export default ExploreListCard;
