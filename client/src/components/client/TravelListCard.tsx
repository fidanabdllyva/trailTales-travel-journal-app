import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Lock, Users } from "lucide-react"
import type { TravelListType } from "@/types/TravelListType"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

interface TravelListCardProps {
  list: TravelListType
}
export default function TravelListCard({ list }: TravelListCardProps) {
  const completed = list.destinations.filter((d) => d.status === "completed").length  || 0;

  const total = list.destinations?.length || 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const visibility = list.isPublic ? "public" : "private";

  const currentUserId = useSelector((s: RootState) => s.user.data?.id);
  const isOwn = list.owner?.id === currentUserId;

  const collaboratorCount = list.collaborators?.length || 0;

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all cursor-pointer">
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

        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 shadow">
          {visibility === "public" ? <Globe size={14} /> : <Lock size={14} />}
          <span className="text-xs capitalize">{visibility}</span>
        </div>

        {isNew(list.createdAt) && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
            New
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-base line-clamp-1">
          <Link to={`/travel-list/${list.id}`}>{list.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">{list.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm font-medium">
          {completed}/{total} destinations completed
        </p>
        <Progress value={progress} />
        {list.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {list.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center pb-6 justify-between text-xs text-muted-foreground">
        {isOwn ? (
          <div className="flex items-center gap-1">
            <Users size={14} /> {collaboratorCount} collaborator{collaboratorCount !== 1 ? "s" : ""}
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

