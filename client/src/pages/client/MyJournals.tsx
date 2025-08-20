import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Badge } from "@/components/ui/badge";

const MyJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState<JournalEntryType[]>([]);
  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  // ✅ Mock journals (directly inside component)
  const mockJournals: any = [
    {
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
      comments: [],
      location: { country: "France", city: "Paris" },
      author: "u1",
      public: true,
      createdAt: new Date("2025-08-01").toISOString(),
      updatedAt: new Date("2025-08-01").toISOString(),
    },
    {
      id: "2",
      title: "Exploring Tokyo Nights",
      content:
        "Shibuya Crossing was insane! Ate the best ramen 🍜 and explored Akihabara’s neon lights.",
      photos: [
        { url: "https://source.unsplash.com/800x600/?tokyo,night", _id: "p3" },
      ],
      likes: [{ userId: "u3", createdAt: new Date().toISOString() }],
      comments: [],
      location: { country: "Japan", city: "Tokyo" },
      author: "u2",
      public: true,
      createdAt: new Date("2025-07-20").toISOString(),
      updatedAt: new Date("2025-07-20").toISOString(),
    },
    {
      id: "3",
      title: "Weekend in Rome",
      content:
        "The Colosseum is breathtaking. Enjoyed gelato while walking through Trastevere. 🍦",
      photos: [
        { url: "https://source.unsplash.com/800x600/?rome,colosseum", _id: "p4" },
      ],
      likes: [],
      comments: [],
      location: { country: "Italy", city: "Rome" },
      author: "u1",
      public: false,
      createdAt: new Date("2025-06-15").toISOString(),
      updatedAt: new Date("2025-06-15").toISOString(),
    },
  ];

  useEffect(() => {
    setJournals(mockJournals.filter((j) => j.author === currentUserId || !currentUserId));
  }, []);

  return (
    <div className="p-6">
      {/* Top action */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">My Journals</h2>
        <Button onClick={() => navigate("/journal/create")}>✍️ Write Entry</Button>
      </div>

      {/* Empty state */}
      {journals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No journals yet.</p>
          <Button
            className="mt-4"
            onClick={() => navigate("/journal/create")}
          >
            Create your first entry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {journals.map((journal) => (
            <Card
              key={journal.id}
              className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {/* Image with hover effect */}
              {journal.photos?.length > 0 && (
                <div className="relative group">
                  <img
                    src={journal.photos[0].url}
                    alt={journal.title}
                    className="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Privacy Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={journal.public ? "default" : "secondary"}>
                      {journal.public ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-5">
                {/* Title & Location */}
                <h3 className="font-semibold text-lg">{journal.title}</h3>
                <p className="text-sm text-gray-500">
                  📍 {journal.location.city}, {journal.location.country}
                </p>

                {/* Content Preview */}
                <p className="text-sm mt-2 line-clamp-2 text-gray-700">
                  {journal.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>❤️ {journal.likes.length}</span>
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(journal.createdAt))}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJournals;
