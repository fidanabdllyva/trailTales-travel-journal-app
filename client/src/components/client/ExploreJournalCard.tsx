import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Heart, MessageCircle, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

// Single card
type JournalCardProps = {
  title: string;
  excerpt: string;
  city: string;
  country: string;
  minutes: number;
  likes: number;
  comments: number;
  author: { name: string; avatar?: string };
  date: string; // ISO string or display date
  imageUrl?: string;
};

function ExploreJournalCard({
  title,
  excerpt,
  city,
  country,
  minutes,
  likes,
  comments,
  author,
  date,
  imageUrl,
}: JournalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden rounded-2xl border-muted shadow-sm transition hover:shadow-md">
        {/* Read time badge */}
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="secondary" className="gap-1 px-2 py-1 text-xs">
            <Clock className="h-3 w-3" /> {minutes} min read
          </Badge>
        </div>

        {/* Image area / placeholder */}
        <div className="relative">
          <div className="aspect-[16/11] w-full overflow-hidden bg-muted/50">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={title}
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
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {city}, {country}
            </span>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground/90">{excerpt}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">by {author.name}</span>
            <span className="mx-1 text-muted-foreground/50">•</span>
            <span className="text-muted-foreground">{date}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Mock data similar to the screenshot
const MOCK: JournalCardProps[] = [
  {
    title: "Sunrise at Angkor Wat: A Spiritual Journey",
    excerpt:
      "Waking up at 4 AM seemed crazy until I witnessed the most breathtaking sunrise of my life over the ancient temples of Angkor Wat...",
    city: "Siem Reap",
    country: "Cambodia",
    minutes: 5,
    likes: 89,
    comments: 23,
    author: { name: "David Kim" },
    date: "1/18/2024",
  },
  {
    title: "Street Food Adventures in Bangkok",
    excerpt:
      "From pad thai on the streets to Michelin-starred restaurants, Bangkok's food scene is absolutely incredible. Here's my ultimate food guide...",
    city: "Bangkok",
    country: "Thailand",
    minutes: 8,
    likes: 156,
    comments: 34,
    author: { name: "Lisa Chen" },
    date: "1/15/2024",
  },
  {
    title: "Northern Lights in Iceland: Tips for First-Timers",
    excerpt:
      "After three failed attempts, I finally saw the Northern Lights in all their glory. Here's everything I learned about timing, location, and patience...",
    city: "Reykjavik",
    country: "Iceland",
    minutes: 6,
    likes: 203,
    comments: 45,
    author: { name: "Alex Johnson" },
    date: "1/12/2024",
  },
];

export default function JournalEntriesMock() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK.map((item, idx) => (
          <ExploreJournalCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
