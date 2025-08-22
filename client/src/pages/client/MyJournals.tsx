import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getUserOwnJournal } from "@/api/requests/journalEntryService";
import { Link } from "react-router-dom";
import { Heart, MapPin, MessageCircle, Plus } from "lucide-react";
import moment from "moment";

const MyJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await getUserOwnJournal();
        setJournals(res.data ?? []);
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  if (loading) {
    return (<LoadingSpinner />)
  }

  return (
    <div className="p-6">
      {/* Top action */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold ">My Journal Entries</h2>
        <Button onClick={() => navigate("/journal/create")}><Plus/> Write Entry</Button>
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
                  <Link to={`/journal/${journal.id}`}>
                    <div className="w-full h-60">

                      <img
                        src={journal.photos[0].url}
                        alt={journal.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Privacy Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant={journal.public ? "default" : "secondary"}>
                        {journal.public ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </Link>
                </div>
              )}

              <CardContent className="p-5">
                {/* Title & Location */}
                <Link to={`/journal/${journal.id}`} >
                  <h3 className="font-semibold mb-2 cursor-pointer text-lg">{journal.title}</h3>
                </Link>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={15} /> {journal.location.city}, {journal.location.country}
                </div>

                {/* Content Preview */}
                <p className="text-sm mt-2 line-clamp-2 text-gray-700">
                  {journal.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Heart size={13} /> {journal.likes.length}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={13} /> {journal.comments.length}</span>
                  </div>
                  <span>
                    {moment(journal.createdAt).format("MMM D, YYYY")}
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
