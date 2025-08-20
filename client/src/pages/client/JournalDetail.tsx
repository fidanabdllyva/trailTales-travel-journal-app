"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, MessageCircle, Send } from "lucide-react";

// ✅ Mock journal data
const mockJournal = {
  id: "1",
  title: "A Perfect Day in Paris",
  content:
    "Visited the Eiffel Tower, tried croissants, and strolled along the Seine. The sunset was magical 🌆.",
  photos: [
    { url: "https://source.unsplash.com/800x600/?eiffel,tower", _id: "p1" },
    { url: "https://source.unsplash.com/800x600/?croissant,paris", _id: "p2" },
  ],
  likes: [
    { userId: "u1", createdAt: new Date().toISOString() },
    { userId: "u2", createdAt: new Date().toISOString() },
  ],
  comments: [
    {
      id: "c1",
      user: { id: "u2", name: "Alice" },
      text: "This looks amazing 😍",
      createdAt: new Date().toISOString(),
    },
    {
      id: "c2",
      user: { id: "u3", name: "Bob" },
      text: "Paris sunsets are unbeatable!",
      createdAt: new Date().toISOString(),
    },
  ],
  location: { country: "France", city: "Paris" },
  author: { id: "u1", name: "Fidan" },
  public: true,
  createdAt: new Date("2025-08-01").toISOString(),
};

const JournalDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(mockJournal.comments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: String(Date.now()),
        user: { id: "me", name: "You" },
        text: newComment,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md flex overflow-hidden">
      {/* Left: Photos Carousel */}
      <div className="w-1/2 border-r">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {mockJournal.photos.map((photo) => (
              <CarouselItem key={photo._id}>
                <img
                  src={photo.url}
                  alt={mockJournal.title}
                  className="w-full h-[600px] object-cover"
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
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar>
            <AvatarImage src="https://source.unsplash.com/50x50/?person" />
            <AvatarFallback>{mockJournal.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{mockJournal.author.name}</p>
            <p className="text-xs text-gray-500">
              📍 {mockJournal.location.city}, {mockJournal.location.country}
            </p>
          </div>
        </div>

        {/* Content & Comments */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Story */}
          <p className="text-sm mb-4">
            <span className="font-semibold">{mockJournal.author.name}</span>{" "}
            {mockJournal.content}
          </p>

          {/* Comments */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-semibold">{c.user.name} </span>
                {c.text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer (likes, actions) */}
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
            {liked
              ? mockJournal.likes.length + 1
              : mockJournal.likes.length}{" "}
            likes
          </p>
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <Button size="sm" onClick={handleAddComment}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
