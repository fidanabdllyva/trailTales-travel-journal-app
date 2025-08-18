import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { RootState } from "@/redux/store"
import type { TravelListType } from "@/types/TravelListType"
import { ClockPlus, Globe, Lock, Share2, Users } from "lucide-react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"

interface TravelListCardProps {
  list: TravelListType
}
export default function TravelListCard({ list }: TravelListCardProps) {
  const completed = list.destinations.filter((d) => d.status === "completed").length || 0;

  const total = list.destinations?.length || 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const currentUserId = useSelector((s: RootState) => s.user.data?.id);
  const isOwn = list.owner?.id === currentUserId;

  const collaboratorCount = list.collaborators?.length || 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all">
      <div className="relative h-48 w-full overflow-hidden">
        {list.coverImage ? (
          <img
            src={list.coverImage}
            alt={list.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />



        <div className="absolute top-2 right-2 flex  gap-1 items-end">
          <div
            className={`px-2 py-0.5 rounded-full text-black text-xs bg-muted`}
          >
            {list.isPublic ? (<>
              <div className="flex items-center gap-1">
                <Globe size={13} />
                <span className="font-medium">Public</span>

              </div>
            </>) :
              (<>
                <div className="flex items-center gap-1">
                  <Lock size={13} />
                  <span className="font-medium">Private</span>

                </div>
              </>)}
          </div>
          {isNew(list.createdAt) && (
            <div className="px-2 py-0.5 flex items-center gap-1 rounded-full bg-purple-500 text-white text-xs">
              <ClockPlus size={13} />
              New
            </div>
          )}
        </div>


      </div>

      <CardHeader className="flex items-center justify-between">
        <div>

          <CardTitle className="text-base line-clamp-1">
            <Link to={`/travel-list/${list.id}`} className="hover:underline transition-all text-xl">{list.title}</Link>
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">{list.description}</CardDescription>
        </div>

        <Button variant="ghost" className="cursor-pointer" size="icon" onClick={handleShare}>
          <Share2 size={17} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">

          <p className="text-sm text-muted-foreground">
            {completed}/{total} destinations completed
          </p>
          <Progress className="flex-1 max-w-[150px]" value={progress} />

        </div>
        <div>
          {list.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {list.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {list.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{list.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

      </CardContent>

      <CardFooter className="flex items-center pb-6 justify-between text-xs text-muted-foreground">
        {isOwn ? (
          <div className="flex items-center gap-1">
            <Users size={14} /> {collaboratorCount} collaborator{collaboratorCount > 1 ? "s" : ""}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {list.owner?.profileImage ? (
              <img
                src={list.owner.profileImage}
                alt={list.owner.fullName}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-[10px]">
                ?
              </div>
            )}
            <span>by {list.owner?.fullName || "Unknown"}</span>
          </div>
        )}
        <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}

function isNew(createdAt: string | Date) {
  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime)) return false;
  const daysOld = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
  return daysOld <= 2;
}

