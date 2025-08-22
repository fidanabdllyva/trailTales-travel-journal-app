import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getUserOwnJournal } from "@/api/requests/journalEntryService";
import { Heart, MapPin, MessageCircle, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JournalEntryType } from "@/types/JournalEntryType";
import moment from "moment";

const MyJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await getUserOwnJournal();
        setJournals(res.data ?? []);
      } catch (error) {
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Filter journals
  const publicJournals = journals.filter(j => j.public);
  const draftJournals = journals.filter(j => !j.public);

  const renderJournalCards = (list: JournalEntryType[]) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No journals yet.</p>
          <Button className="mt-4" onClick={() => navigate("/journal/create")}>
            Create your first entry
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {list.map((journal) => (
          <Card
            key={journal.id}
            className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
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
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={journal.public ? "default" : "secondary"}>
                      {journal.public ? "Public" : "Draft"}
                    </Badge>
                  </div>
                </Link>
              </div>
            )}

            <CardContent className="p-5">
              <Link to={`/journal/${journal.id}`}>
                <h3 className="font-semibold mb-2 cursor-pointer text-lg">{journal.title}</h3>
              </Link>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={15} /> {journal.location.city}, {journal.location.country}
              </div>
              <p className="text-sm mt-2 line-clamp-2 text-gray-700">{journal.content}</p>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Heart size={13} /> {journal.likes.length}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={13} /> {journal.comments.length}</span>
                </div>
                <span>{moment(journal.createdAt).format("MMM D, YYYY")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold ">My Journal Entries</h2>
        <Button onClick={() => navigate("/journal/create")}><Plus /> Write Entry</Button>
      </div>

      <Tabs defaultValue="public">
         <TabsList className="mb-6 mx-auto w-xs">
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="public">
          {renderJournalCards(publicJournals)}
        </TabsContent>

        <TabsContent value="draft">
          {renderJournalCards(draftJournals)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyJournals;
