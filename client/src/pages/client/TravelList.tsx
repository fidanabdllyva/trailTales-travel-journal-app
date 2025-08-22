import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, CheckCircle2, Users2, Pencil, Share2, MessageSquare, Heart, MessageCircle } from "lucide-react";
import type { TravelListType } from "@/types/TravelListType";
import { getTravelList } from "@/api/requests/travelListService";
import TravelListMembers from "@/components/client/TravelListMembers";
import TravelLIstChat from "@/components/client/TravelLIstChat";
import TravelListSettings from "@/components/client/TravelListSettings";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import TravelListDestinations from "@/components/client/TravelListDestinations";
import { toast } from "sonner";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { getPublicJournalEntries } from "@/api/requests/journalEntryService";
import type { DestinationType } from "@/types/DestinationType";

// Simple stat card
function StatCard({
  icon,
  value,
  label,
}: {
  icon: any;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 border rounded p-4">
      {icon}
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

// Main Page
export default function TravelListDetail() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<TravelListType | null>(null);
  const [activeTab, setActiveTab] = useState("destinations");
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<JournalEntryType[]>([]);
  const [photos, setPhotos] = useState<{ url: string; public_id: string }[]>([]);
  const navigate = useNavigate();

  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  // Fetch Travel List
  const fetchList = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getTravelList(id);
      setList(res.data);
    } catch (error) {
      console.error("Failed to load travel list", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Journals for all destinations
  const fetchJournalsByDestinations = async () => {
    if (!list) return;

    try {
      const res = await getPublicJournalEntries({ limit: 1000 });
      const allJournals: JournalEntryType[] = [];

      for (const j of res.entries) {
        const match = list.destinations.some(dest => {
          console.log(
            "Checking:",
            dest.location.city,
            dest.location.country,
            "against",
            j.location.city,
            j.location.country
          );
          return (
            dest.location.city.toLowerCase() === j.location.city.toLowerCase() &&
            dest.location.country.toLowerCase() === j.location.country.toLowerCase()
          );
        });

        if (match) {
          allJournals.push(j);
        }
      }

      console.log("Matched journals:", allJournals);

      setJournals(allJournals);
      setPhotos(allJournals.flatMap(j => j.photos || []));
    } catch (err) {
      console.error("Failed to fetch journals:", err);
    }
  };



  useEffect(() => {
    fetchList();
  }, [id]);

  useEffect(() => {
    if (list) fetchJournalsByDestinations();
  }, [list]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {loading && <div className="p-6 text-center">Loading travel list...</div>}

      {!loading && !currentUserId && (
        <div className="p-6 text-center text-red-500">User not found.</div>
      )}

      {!loading && currentUserId && !list && (
        <div className="p-6 text-center text-red-500">Travel list not found.</div>
      )}

      {!loading && currentUserId && list && (
        <>
          {/* Back button */}
          <div className="mb-4 text-sm">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
          </div>

          {/* Hero */}
          <div className="relative mb-6 overflow-hidden rounded-xl border">
            <div
              className="aspect-[16/5] w-full bg-gray-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${list.coverImage})` }}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
              <h1 className="text-4xl font-semibold text-white drop-shadow-sm">{list.title}</h1>
              <p className="mt-2 max-w-2xl text-white/90">{list.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {list.tags?.map((t, index) => (
                  <Badge key={`${t}-${index}`} variant="secondary" className="bg-white/90 text-gray-900">
                    #{t}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 self-end">
                {(list.owner.id === currentUserId || list.collaborators.some(c => c.id === currentUserId)) ? (
                  <>
                    {list.collaborators.length > 0 ? (
                      <TravelLIstChat listId={list.id} />
                    ) : (
                      <Button
                        variant="secondary"
                        className="bg-gray-200 text-gray-500 cursor-not-allowed"
                        onClick={() => toast.info("No collaborators to chat with")}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat (No Collaborators)
                      </Button>
                    )}
                    <TravelListSettings
                      listId={list.id}
                      userId={currentUserId}
                      ownerId={list.owner.id}
                      isCollaborator={list.collaborators.some(c => c.id === currentUserId)}
                      onDeleted={() => navigate(-1)}
                      onUpdated={async () => await fetchList()}
                    />
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="bg-gray-200 text-gray-500 cursor-not-allowed"
                    onClick={() => toast.info("Invite collaborators to use chat")}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Chat (Invite Only)
                  </Button>
                )}
                <Button variant="secondary" className="bg-white/90 text-gray-900" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
            <StatCard icon={<MapPin className="h-5 w-5 text-blue-500" />} value={list.destinations.length} label="Destinations" />
            <StatCard icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} value={list.destinations.filter((d) => d.status === "completed").length} label="Completed" />
            <StatCard icon={<Users2 className="h-5 w-5 text-purple-600" />} value={list.collaborators.length} label="Members" />
            <StatCard icon={<Pencil className="h-5 w-5 text-orange-500" />} value={journals.length} label="Journal Entries" />
          </div>

          {/* Members */}
          <TravelListMembers members={list.collaborators as any} list={list} />

          {/* Tabs */}
          <Tabs defaultValue="destinations" value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="journals">Journal Entries</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            {/* Destinations */}
            <TabsContent value="destinations" className="space-y-4">
              {list.destinations.map((d) => (
                <TravelListDestinations
                  key={d.id}
                  destination={d}
                  ownerId={list.owner.id}
                  collaborators={list.collaborators}
                  onDeleted={(deletedId) => setList(prev => prev ? { ...prev, destinations: prev.destinations.filter(dest => dest.id !== deletedId) } : prev)}
                  onUpdated={(updated) => setList(prev => prev ? { ...prev, destinations: prev.destinations.map(dest => dest.id === updated.id ? updated : dest) } : prev)}
                />
              ))}
            </TabsContent>

            {/* Journals */}
            {/* Journals */}
            <TabsContent value="journals" className="space-y-4">
              {journals.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">
                  No journal entries yet.
                </div>
              ) : (
                journals.map((j) => (
                  <div
                    key={j.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Header: Title + Public/Private */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{j.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {j.location.city}, {j.location.country} •{" "}
                          {new Date(j.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={j.public ? "bg-emerald-600 text-white" : "bg-gray-500 text-white"}
                      >
                        {j.public ? "Public" : "Private"}
                      </Badge>
                    </div>

                    {/* Content Preview */}
                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {j.content}
                    </p>

                    {/* Photos Preview */}
                    {j.photos && j.photos.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {j.photos.slice(0, 10).map((photo, idx) => (
                          <div
                            key={idx}
                            className="w-20 h-20 bg-gray-200 rounded overflow-hidden"
                          >
                            <img
                              src={photo.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer: Likes, Comments, Read More */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart size={12}/> {j.likes?.length || 0} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} /> {j.comments?.length || 0} comments
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/journal/${j.id}`)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>


            {/* Photos */}
            <TabsContent value="photos">
              {photos.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No images to display yet.</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="aspect-[4/3] w-full rounded-lg bg-muted overflow-hidden">
                      <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
