import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/features/userSlice";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { FiFilter } from "react-icons/fi";
import { MapPin, Star, Users, Calendar, Search, Plus } from "lucide-react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TravelListType } from "@/types/TravelListType";
import { getUserTravelLists } from "@/api/requests/travelListService";
import TravelListCard from "@/components/client/TravelListCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data: userData, status: userStatus, error } = useSelector((s: RootState) => s.user);

  const [lists, setLists] = useState<TravelListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Redirect & fetch user
  useEffect(() => {
    if (!token || !isAuthenticated) {
      navigate("/");
    } else if (userStatus === "idle") {
      // @ts-ignore
      dispatch(fetchUserProfile());
    }
  }, [token, isAuthenticated, userStatus, dispatch, navigate]);

  // Fetch travel lists
useEffect(() => {
  getUserTravelLists()
    .then((res) => {
      console.log("API response:", res);
      setLists(res.data ?? []); // ✅ use .data, not the whole response
    })
    .catch(() => console.error("Failed to load lists"))
    .finally(() => setLoading(false));
}, []);


  // Split lists
  const myId = userData?.id;
  const myLists = lists.filter((l) => l.owner?.id === myId);
  const sharedLists = lists.filter(
    (l) => l.owner?.id !== myId && l.collaborators?.some((u) => u.id === myId)
  );

  // Filter function
  const filterLists = (arr: TravelListType[]) =>
    query.trim()
      ? arr.filter((l) =>
        [l.title, l.description, ...(l.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      : arr;

  const filteredMy = useMemo(() => filterLists(myLists), [myLists, query]);
  const filteredShared = useMemo(() => filterLists(sharedLists), [sharedLists, query]);

  // Stats
  const stats = useMemo(() => {
    const destinations = lists.flatMap((l) => l.destinations || []);
    return {
      total: destinations.length,
      completed: destinations.filter((d) => d.status === "completed").length,
      collaborators: new Set(lists.flatMap((l) => l.collaborators?.map((u) => u.id) || [])).size,
      thisYear: lists.filter((d) => new Date(d.createdAt).getFullYear() === new Date().getFullYear()).length,
    };
  }, [lists]);

  if (loading || userStatus === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Welcome back, <span className="text-purple-600">{userData?.fullName}</span>
            <MdOutlineWavingHand />
          </h1>
          <p className="text-gray-600">Ready for your next adventure?</p>
        </div>
        <Link to="/travel-list/create">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create New List
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Destinations", value: stats.total, icon: <MapPin className="text-blue-500 bg-blue-100 rounded-lg w-10 h-10 p-1.5" /> },
          { label: "Completed", value: stats.completed, icon: <Star className="text-green-500 bg-green-100 w-10 rounded-lg h-10 p-1.5" /> },
          { label: "Collaborators", value: stats.collaborators, icon: <Users className="text-purple-500 bg-purple-100 w-10 rounded-lg h-10 p-1.5" /> },
          { label: "This Year", value: stats.thisYear, icon: <Calendar className="text-orange-500 bg-orange-100 w-10 rounded-lg h-10 p-1.5" /> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm px-4 py-6 flex items-center gap-4 border">
            {s.icon}
            <div>
              <p className="text-gray-600">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Search */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 w-full border px-2 rounded-md bg-white shadow-sm">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2 outline-none border-none"
          />
        </div>
        <button className="ml-3 px-4 py-2 flex  items-center bg-white gap-2 border rounded-md hover:bg-gray-100">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Lists */}
      <Tabs defaultValue="my" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="my">My Lists  ({filteredMy.length})</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me ({filteredShared.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          {filteredMy.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMy.map((list) => (
                <TravelListCard key={list.id} list={list} />

              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No lists found</p>
          )}
        </TabsContent>

        <TabsContent value="shared">
          {filteredShared.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShared.map((list) => (
                <TravelListCard key={list.id} list={list} />

              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No shared lists found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
