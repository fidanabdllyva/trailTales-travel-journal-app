import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/features/userSlice";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { FiFilter } from "react-icons/fi";
import { Globe, Lock, Users, Calendar, MapPin, Star, Search, Plus, ImageOff } from "lucide-react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TravelListType } from "@/types/TravelListType";
import { getUserTravelLists } from "@/api/requests/travelListService";
import TravelListCard from "@/components/client/TravelListCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data: userData, status: userStatus, error } = useSelector((s: RootState) => s.user);

  const [lists, setLists] = useState<TravelListType[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // auth + user bootstrap
  useEffect(() => {
    if (!token || !isAuthenticated) {
      navigate("/");
      return;
    }
    if (userStatus === "idle") {
      // @ts-ignore (if your thunk type isn't exported)
      dispatch(fetchUserProfile());
    }
  }, [token, isAuthenticated, userStatus, dispatch, navigate]);

  // fetch lists
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserTravelLists();
        setLists(data ?? []);
      } catch (e: any) {
        setListsError(e?.message || "Failed to load your lists");
      } finally {
        setListsLoading(false);
      }
    })();
  }, []);

  // split: my vs shared
  const myId = userData?.id;
  const { myLists, sharedWithMe } = useMemo(() => {
    const mine: TravelListType[] = [];
    const shared: TravelListType[] = [];
    for (const l of lists) {
      if (l.owner?._id === myId) mine.push(l);
      else shared.push(l);
    }
    return { myLists: mine, sharedWithMe: shared };
  }, [lists, myId]);

  // search filter
  const filterLists = (arr: TravelListType[]) => {
    if (!query.trim()) return arr;
    const q = query.toLowerCase();
    return arr.filter((l) => {
      const inTitle = l.title?.toLowerCase().includes(q);
      const inDesc = l.description?.toLowerCase().includes(q);
      const inTags = l.tags?.some((t) => t.toLowerCase().includes(q));
      const inDest = l.destinations?.some(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      );
      return inTitle || inDesc || inTags || inDest;
    });
  };

  const filteredMy = useMemo(() => filterLists(myLists), [myLists, query]);
  const filteredShared = useMemo(() => filterLists(sharedWithMe), [sharedWithMe, query]);

  // stats (derived from destinations across *all* lists the user participates in)
  const stats = useMemo(() => {
    const allDest = lists.flatMap((l) => l.destinations || []);
    const totalDestinations = allDest.length;

    const completed = allDest.filter(
      (d) => d.status === "completed" || (d.dateVisited && new Date(d.dateVisited).toString() !== "Invalid Date")
    ).length;

    const collaboratorIds = new Set<string>();
    lists.forEach((l) => l.collaborators?.forEach((u) => u?.id && collaboratorIds.add(u.id)));

    const year = new Date().getFullYear();
    const thisYear = allDest.filter((d) => {
      const dv = d.dateVisited ? new Date(d.dateVisited) : null;
      const dp = d.datePlanned ? new Date(d.datePlanned) : null;
      const y = (dv && !isNaN(+dv) && dv.getFullYear()) || (dp && !isNaN(+dp) && dp.getFullYear());
      return y === year;
    }).length;

    return {
      totalDestinations,
      completed,
      collaborators: collaboratorIds.size,
      thisYear,
    };
  }, [lists]);

  if (userStatus === "loading" || listsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (userStatus === "failed" || listsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold text-red-600">Error loading dashboard</h1>
        <p className="text-gray-600">{error || listsError}</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Destinations", value: stats.totalDestinations, icon: <MapPin className="text-blue-500 bg-blue-100 rounded-lg w-10 h-10 p-1.5" /> },
    { label: "Completed", value: stats.completed, icon: <Star className="text-green-500 bg-green-100 w-10 rounded-lg h-10 p-1.5" /> },
    { label: "Collaborators", value: stats.collaborators, icon: <Users className="text-purple-500 bg-purple-100 w-10 rounded-lg h-10 p-1.5" /> },
    { label: "This Year", value: stats.thisYear, icon: <Calendar className="text-orange-500 bg-orange-100 w-10 rounded-lg h-10 p-1.5" /> },
  ];

  const isNew = (createdAt?: Date) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    if (isNaN(+created)) return false;
    const diffDays = (Date.now() - +created) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; // "New" if created within 7 days
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, <span className="text-purple-600">{userData?.fullName || "Traveler"}</span>
            <MdOutlineWavingHand className="text-gray-600" />
          </h1>
          <p className="text-gray-600 mt-1">Ready for your next adventure?</p>
        </div>
        <Link to={"/travel-list/create"} className="flex items-center">
          <Button className="flex items-center space-x-1 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Plus className="w-4 h-4" />
            <span>Create a New List</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm px-4 gap-4 py-6 flex items-center border">
            {s.icon}
            <div className="flex flex-col">
              <span className="text-gray-600">{s.label}</span>
              <span className="text-2xl font-bold">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2 w-full border px-2 rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search destinations, lists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-100 border-none py-2 outline-none"
          />
        </div>
        <button className="ml-3 px-4 py-2 flex items-center bg-white gap-2 border rounded-md hover:bg-gray-100">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="my">My Lists</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          {filteredMy.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMy.map((list) => (
                <TravelListCard
                  key={list.id}
                  title={list.title}
                  description={list.description}
                  completed={
                    list.destinations?.filter(
                      (d) =>
                        d.status === "completed" ||
                        (d.dateVisited && new Date(d.dateVisited).toString() !== "Invalid Date")
                    ).length || 0
                  }
                  total={list.destinations?.length || 0}
                  coverImage={list.coverImage}
                  tags={list.tags || []}
                  visibility={list.isPublic ? "public" : "private"}
                  isNew={isNew(list.createdAt)}
                  collaborators={list.collaborators?.length || 0}
                  createdAt={list.createdAt ? new Date(list.createdAt).toLocaleDateString() : ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No lists found</p>
          )}
        </TabsContent>

        <TabsContent value="shared">
          {filteredShared.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShared.map((list) => (
                <TravelListCard
                  key={list.id}
                  title={list.title}
                  description={list.description}
                  completed={
                    list.destinations?.filter(
                      (d) =>
                        d.status === "completed" ||
                        (d.dateVisited && new Date(d.dateVisited).toString() !== "Invalid Date")
                    ).length || 0
                  }
                  total={list.destinations?.length || 0}
                  coverImage={list.coverImage}
                  tags={list.tags || []}
                  visibility={list.isPublic ? "public" : "private"}
                  isNew={isNew(list.createdAt)}
                  collaborators={list.collaborators?.length || 0}
                  createdAt={list.createdAt ? new Date(list.createdAt).toLocaleDateString() : ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No shared lists found</p>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Dashboard;
