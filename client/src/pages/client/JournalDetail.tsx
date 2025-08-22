import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EllipsisVertical, Heart, MapPin, MessageCircle, Send } from "lucide-react";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { getJournalEntryById } from "@/api/requests/journalEntryService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useParams } from "react-router";
import type { CommentType } from "@/types/CommentType";

const JournalDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [journal, setJournal] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchJournal = async () => {
      try {
        const response = await getJournalEntryById(id);
        console.log("Fetched journal:", response);
        setJournal(response);
        // setComments(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching journal entry:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [id]);

  // ✅ return checks *after* state has had a chance to update
  if (loading) return <LoadingSpinner />;
  if (!journal) return <p>No Journal Entry</p>;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: String(Date.now()),
        user: { id: "me", username: "You" },
        text: newComment,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  return (
    <>
    
     <div className="min-h-screen flex justify-center items-start pt-10 bg-gray-50">

      <div className="max-w-5xl w-full h-[600px] bg-white rounded-xl shadow-md flex overflow-hidden">
        {/* Left: Photos Carousel */}
        <div className="w-1/2 border-r">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {journal.photos.map((photo) => (
                <CarouselItem className="h-[600px]" key={photo.public_id}>
                  <img
                    src={photo.url}
                    alt={journal.title}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Right: Details */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b">
            <div className="flex items-center gap-2"> 

            <Avatar>
              <AvatarImage src={journal.author.profileImage} />
              <AvatarFallback>{journal.author.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{journal.author.username}</p>
              <p className="text-xs flex items-center gap-1 text-gray-500">
                <MapPin size={12}/> {journal.location.city}, {journal.location.country}
              </p>
            </div>
            </div>

            <EllipsisVertical />
          </div>

          {/* Content & Comments */}
          <div className="flex-1 p-4">
            {/* Story */}
            <p className="text-sm mb-4">
              <span className="font-semibold">{journal.author.username}</span>{" "}
              {journal.content}
            </p>

            {/* Comments */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold">{c.user.username} </span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-2">
              <Heart
                className={`w-6 h-6 cursor-pointer ${
                  liked ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
                onClick={() => setLiked(!liked)}
              />
              <MessageCircle className="w-6 h-6 text-gray-600" />
              <Send className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-sm font-semibold">
              {liked ? journal.likes.length + 1 : journal.likes.length} likes
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default JournalDetail;
