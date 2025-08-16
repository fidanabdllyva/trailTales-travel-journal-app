import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin, CheckCircle2, Users2, Pencil, MessageSquare,
  Share2, Settings, CalendarDays
} from "lucide-react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import type { TravelListType } from "@/types/TravelListType";
import { getTravelList } from "@/api/requests/travelListService";

// Mock formatDate function
const formatDate = (date?: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

// Types
type Member = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
};

// Members component
function Members({ members }: { members: Member[] }) {
  return (
    <div className="flex gap-3 mt-4">
      {members.map((m) => (
        <div key={m.id} className="flex flex-col items-center text-sm">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {m.avatarUrl && (
              <img
                src={m.avatarUrl}
                alt={m.fullName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span>{m.fullName}</span>
        </div>
      ))}
    </div>
  );
}

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

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getTravelList(id);
        setList(data);
      } catch (error) {
        console.error("Failed to load travel list", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading travel list...</div>;
  }

  if (!list) {
    return <div className="p-6 text-center text-red-500">Travel list not found.</div>;
  }

  // Public photos from journals
  const publicPhotos =
    (list as any).journals?.filter((j: any) => j.public && j.photos.length > 0)
      .flatMap((j:any ) => j.photos) || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Back */}
      <div className="mb-4 text-sm">
        <Link
          to={"/dashboard"}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-xl border">
        {/* Background image */}
        <div
          className="aspect-[16/5] w-full bg-gray-300 bg-cover bg-center"
          style={{ backgroundImage: `url(${list.coverImage})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
          <h1 className="text-4xl font-semibold text-white drop-shadow-sm">
            {list.title}
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">{list.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {list.tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="bg-white/90 text-gray-900"
              >
                #{t}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 self-end">
            <Button variant="secondary" className="bg-white/90 text-gray-900">
              <MessageSquare className="mr-2 h-4 w-4" /> Chat
            </Button>
            <Button variant="secondary" className="bg-white/90 text-gray-900">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="secondary" className="bg-white/90 text-gray-900">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <StatCard
          icon={<MapPin className="h-5 w-5 text-blue-500" />}
          value={list.destinations.length}
          label="Destinations"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          value={0}
          label="Completed"
        />
        <StatCard
          icon={<Users2 className="h-5 w-5 text-purple-600" />}
          value={list.collaborators.length}
          label="Members"
        />
        <StatCard
          icon={<Pencil className="h-5 w-5 text-orange-500" />}
          value={(list as any).journals?.length || 0}
          label="Journal Entries"
        />
      </div>

      {/* Members */}
      <Members members={list.collaborators as any} />

      {/* Tabs */}
      <Tabs
        defaultValue="destinations"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v)}
        className="mt-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="journals">Journal Entries</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        {/* Destinations */}
        <TabsContent value="destinations" className="space-y-4">
          {list.destinations.map((d) => (
            <Card key={d.id} className="flex">
             
                <img
                  src={d.image.url}
                  alt={d.location.country}
                  className="w-40 h-32 object-cover"
                />
      
              <div className="p-4 flex-1">
                <h3 className="text-xl font-semibold">{d.location.city}, {d.location.country} </h3>
                <p className="text-gray-500">{d.location.city}</p>
                <p>{d.status}</p>
                <p className="text-gray-600 mt-2">{d.notes}</p>
                <div className="mt-2 text-sm text-gray-500 flex gap-4">
                  {d.datePlanned && (
                    <span>
                      <CalendarDays /> Planned: {formatDate(d.datePlanned)}
                    </span>
                  )}
                  {d.dateVisited && (
                    <span>
                      <CalendarDays /> Visited: {formatDate(d.dateVisited)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Journals */}
        <TabsContent value="journals" className="space-y-4">
          {(list as any).journals?.map((j:any) => (
            <Card key={j.id}>
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Destination: {j.destination.name}
                    </div>
                    <h3 className="text-2xl font-semibold">{j.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(j.createdAt)}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      j.public
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-white"
                    }
                  >
                    {j.public ? "Public" : "Private"}
                  </Badge>
                </div>
                <p className="max-w-4xl text-muted-foreground">{j.content}</p>
                <div className="flex gap-2">
                  {j.photos.map((p, i) => (
                    <img
                      key={i}
                      src={p.url}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex gap-2 items-center">
                    <FaRegHeart /> {j.likes}
                  </span>
                  <span className="flex gap-2 items-center">
                    <FaRegComment /> {j.comments}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Photos */}
        <TabsContent value="photos">
          {publicPhotos.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No images to display yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {publicPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] w-full rounded-lg bg-muted overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
