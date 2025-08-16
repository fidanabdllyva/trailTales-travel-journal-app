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
        const data = await getUserTravelLists();
        setLists(data);
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
          <div className="w-1/4 h-50">
            <img
              src={list.coverImage}
              alt={list.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-between p-6 flex-1 h-full">
            <div>
              <h3 className="text-xl font-semibold mb-2">{list.title}</h3>
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

            <div className="mt-4 self-end">
              <Link to={`/travel-list/${list.id}`}>
                <Button variant="outline" size="sm" className="rounded-full">
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
