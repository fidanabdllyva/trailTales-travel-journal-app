import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Lock, Users } from "lucide-react"

interface TravelListCardProps {
  title: string
  description: string
  completed: number
  total: number
  tags: string[]
  visibility: "public" | "private"
  isNew?: boolean
  collaborators: number
  createdAt: string
  coverImage: string
}

export default function TravelListCard({
  title,
  description,
  completed,
  total,
  tags,
  visibility,
  isNew,
  collaborators,
  createdAt,
  coverImage
}: TravelListCardProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all cursor-pointer">
      {/* Image container */}
      <div className="relative h-50 w-full overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        
        {/* Visibility */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 shadow">
          {visibility === "public" ? <Globe size={14} /> : <Lock size={14} />}
          <span className="text-xs capitalize">{visibility}</span>
        </div>

        {/* New badge */}
        {isNew && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
            New
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm font-medium">
          {completed}/{total} destinations completed
        </p>
        <Progress value={progress} />
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={14} /> {collaborators} collaborator{collaborators !== 1 && "s"}
        </div>
        <span>Created {createdAt}</span>
      </CardFooter>
    </Card>
  )
}
