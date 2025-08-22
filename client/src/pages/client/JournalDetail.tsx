import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EllipsisVertical, Heart, MapPin, MessageCircle, Send, Trash2 } from "lucide-react";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { getJournalEntryById, toggleLike } from "@/api/requests/journalEntryService";
import { createComment, getCommentsByJournal, deleteComment } from "@/api/requests/commentsService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useParams } from "react-router";
import type { CommentType } from "@/types/CommentType";
import moment from "moment";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";

const JournalDetail = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState<JournalEntryType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  // Fetch journal and comments
  useEffect(() => {
    if (!id) return;

    const fetchJournalAndComments = async () => {
      try {
        const journalRes = await getJournalEntryById(id);
        setJournal(journalRes);

        const commentsRes = await getCommentsByJournal(id);
        setComments(commentsRes);
      } catch (err) {
        console.error("Error fetching journal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalAndComments();
  }, [id]);

  // Compute liked dynamically
  const liked = journal?.likes.some((like: any) => like.userId === currentUserId) ?? false;
  const likesCount = journal?.likes.length ?? 0;

  // Toggle like
  const handleToggleLike = async () => {
    if (!journal) return;
    try {
      const updated = await toggleLike(journal.id);
      setJournal(updated);
      toast.success(liked ? "Like removed" : "Liked!"); // <-- toast here
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Failed to toggle like"); // <-- error toast
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !journal) return;
    try {
      setCommentLoading(true);
      const created = await createComment(journal.id, newComment);
      setComments(prev => [created, ...prev]);
      setNewComment("");
      toast.success("Comment added!"); // <-- toast here
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment"); // <-- error toast
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Comment deleted"); // <-- toast here
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment"); // <-- error toast
    }
  };


  if (loading) return <LoadingSpinner />;
  if (!journal) return <p>No Journal Entry</p>;

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 bg-gray-50">
      <div className="max-w-5xl w-full h-[600px] bg-white rounded-xl shadow-md flex overflow-hidden">

        {/* Left: Photos Carousel */}
        <div className="w-1/2 border-r">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {journal.photos.map(photo => (
                <CarouselItem className="h-[600px]" key={photo.public_id}>
                  <img src={photo.url} alt={journal.title} className="w-full h-full object-cover" />
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
              </Avatar>
              <div>
                <p className="font-semibold">{journal.author.username}</p>
                <p className="text-xs flex items-center gap-1 text-gray-500">
                  <MapPin size={12} /> {journal.location.city}, {journal.location.country}
                </p>
              </div>
            </div>
            <EllipsisVertical />
          </div>

          {/* Content & Comments */}
          <div className="flex-1 p-4 overflow-y-auto">

            {/* Story */}
            <div className="flex items-start gap-3 pb-5">
              <Avatar>
                <AvatarImage src={journal.author.profileImage} />
              </Avatar>
              <div className="flex-1 mb-1">
                <p className="text-sm">
                  <span className="font-semibold">{journal.author.username}</span> {journal.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(() => {
                    const diff = moment().diff(moment(journal.createdAt));
                    const duration = moment.duration(diff);
                    if (duration.asMinutes() < 60) return Math.floor(duration.asMinutes()) + "m";
                    if (duration.asHours() < 24) return Math.floor(duration.asHours()) + "h";
                    if (duration.asDays() < 7) return Math.floor(duration.asDays()) + "d";
                    return Math.floor(duration.asWeeks()) + "w";
                  })()}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet</p>}
              {comments.map(c => (
                <div key={c.id || c.id} className="text-sm flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={c.author.profileImage} />
                    </Avatar>
                    <div>
                      <span className="font-semibold">{c.author.username} </span>
                      <span>{c.content}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {(() => {
                          const diff = moment().diff(moment(c.createdAt));
                          const duration = moment.duration(diff);
                          if (duration.asMinutes() < 60) return Math.floor(duration.asMinutes()) + "m";
                          if (duration.asHours() < 24) return Math.floor(duration.asHours()) + "h";
                          if (duration.asDays() < 7) return Math.floor(duration.asDays()) + "d";
                          return Math.floor(duration.asWeeks()) + "w";
                        })()}
                      </p>
                    </div>
                  </div>
                  {(c.author.id === currentUserId || c.author.id === currentUserId) && (
                    <button
                      className="text-xs text-red-500"
                      onClick={() => handleDeleteComment(c.id || c.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-2">
              <Heart
                className={`w-6 h-6 cursor-pointer ${liked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                onClick={handleToggleLike}
              />
              <MessageCircle className="w-6 h-6 text-gray-600" />
              <Send className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-sm font-semibold">{likesCount} likes</p>

            {/* Add Comment */}
            <div className="flex items-center gap-2 mt-3">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={commentLoading}
              />
              <Button size="sm" onClick={handleAddComment} disabled={commentLoading}>
                {commentLoading ? "Posting..." : "Post"}
              </Button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
