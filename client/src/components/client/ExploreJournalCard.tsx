import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, MessageCircle, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { JournalEntryType } from "@/types/JournalEntryType";
import moment from "moment";
import { Link } from "react-router-dom";

type JournalCardProps = {
  journal: JournalEntryType;
};

function ExploreJournalCard({ journal }: JournalCardProps) {
  const imageUrl = journal.photos?.[0]?.url;


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden rounded-2xl border-muted shadow-sm transition hover:shadow-md">

        {/* Image */}
        <div className="relative">
          <div className="w-full h-60 overflow-hidden bg-muted/50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={journal.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed">
                  <ImageIcon className="h-6 w-6 opacity-50" />
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <Link to={`/journal/${journal.id}`}>
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
              {journal.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {journal.location.city}, {journal.location.country}
            </span>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground/90">
            {journal.content}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
          {/* Likes & Comments */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{journal.likes.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{journal.comments.length}</span>
            </div>
          </div>

          {/* Author + Time */}
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={journal.author.profileImage}
                alt={journal.author.username}
              />
              <AvatarFallback>
                {journal.author.username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">by {journal.author.username}</span>
            <span className="mx-1 text-muted-foreground/50">•</span>
            <span className="text-muted-foreground">
              {moment(journal.createdAt).format("l")}
            </span>
          </div>
        </CardFooter>

      </Card>
    </motion.div>
  );
}

export default ExploreJournalCard;
