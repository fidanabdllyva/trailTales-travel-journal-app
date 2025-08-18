import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TravelListType } from "@/types/TravelListType";
import { getUserTravelLists } from "@/api/requests/travelListService";

const MyLists = () => {
  const [lists, setLists] = useState<TravelListType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getUserTravelLists(); 
        setLists(res.data ?? []);              
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-3xl font-bold text-center">My Lists</h1>

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-row overflow-hidden rounded-xl">
            <Skeleton className="w-2/5 h-40" />
            <div className="flex-1 p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h1 className="text-3xl font-bold text-center">My Lists</h1>

        <p className="text-lg font-medium">You don’t have any travel lists yet.</p>
        <p className="text-sm text-muted-foreground">
          Create one to start planning your journeys!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-center">My Lists</h1>

      {lists.map((list) => (
        <Card
          key={list.id}
          className="flex flex-row w-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow items-stretch"
        >
          {/* Left: Image */}
          <div className="w-1/4 h-60">
            <img
              src={list.coverImage}
              alt={list.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-between p-6 flex-1 h-full">
            <div>
             <Link className="text-2xl cursor-pointer hover:underline transition-all font-semibold " to={`/travel-list/${list.id}`}>
             {list.title}
             </Link>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {list.description}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {list.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="rounded-full px-3">
                  {tag}
                </Badge>
              ))}
              {list.tags.length > 3 && (
                <Badge variant="outline" className="rounded-full px-3">
                  +{list.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex  mt-3 items-center gap-2">
              {/* Avatars */}
              <div className="flex -space-x-2">
                {list.collaborators.slice(0, 2).map((collab, i) => (
                  <img
                    key={i}
                    src={collab.profileImage}
                    alt={collab.fullName}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}

                {list.collaborators.length > 2 && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    +{list.collaborators.length - 2}
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-sm text-gray-600">
                {list.collaborators.length} collaborator
                {list.collaborators.length > 1 && "s"}
              </span>

              {/* Destinations count */}
              <span className="text-xs text-gray-500">
                {list.destinations.length} destination
                {list.destinations.length > 1 && "s"}
              </span>
            </div>


            <div className="mt-4 self-end">
              <Link to={`/travel-list/${list.id}`}>
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer">
                  View More →
                </Button>
              </Link>
            </div>
          </div>
        </Card>

      ))}
    </div>
  );
};

export default MyLists;
