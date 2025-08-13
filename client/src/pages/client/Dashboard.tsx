import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { FiFilter } from "react-icons/fi";
import { Globe, Lock, Users, Calendar, MapPin, Star, Search, Plus } from "lucide-react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: userData, status: userStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (!token || !isAuthenticated) {
      navigate("/");
      return;
    }
    if (userStatus === "idle") {
      // @ts-ignore
      dispatch(fetchUserProfile());
    }
  }, [token, isAuthenticated, userStatus, dispatch, navigate]);

  if (userStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (userStatus === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold text-red-600">Error loading dashboard</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Mock data for now
  const stats = [
    { label: "Total Destinations", value: 26, icon: <MapPin className="text-blue-500 bg-blue-100 rounded-lg w-10 h-10 p-1.5" /> },
    { label: "Completed", value: 11, icon: <Star className="text-green-500 bg-green-100 w-10 rounded-lg h-10 p-1.5" /> },
    { label: "Collaborators", value: 8, icon: <Users className="text-purple-500 bg-purple-100 w-10 rounded-lg h-10 p-1.5" /> },
    { label: "This Year", value: 5, icon: <Calendar className="text-orange-500 bg-orange-100 w-10 rounded-lg h-10 p-1.5" /> },
  ];

  const travelLists = [
    {
      title: "European Adventure 2024",
      description: "Exploring the historic cities and beautiful landscapes of Europe",
      visibility: "Public",
      isNew: true,
    },
    {
      title: "Southeast Asia Backpacking",
      description: "Budget-friendly adventure through Thailand, Vietnam, and Cambodia",
      visibility: "Private",
      isNew: false,
    },
    {
      title: "Japan Cherry Blossom Tour",
      description: "Experiencing the magical sakura season across Japan",
      visibility: "Public",
      isNew: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back,{" "}
            <span className="text-purple-600">{userData?.fullName || "Traveler"}</span> <MdOutlineWavingHand className="text-gray-600" />
          </h1>
          <p className="text-gray-600 mt-1">Ready for your next adventure?</p>

        </div>
        <Link to={"/travel-list/create"} className="flex  items-center">
          <Button className="flex items-center space-x-1 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Plus className="w-4 h-4" />
            <span>Create a New List</span>
          </Button>
        </Link>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm px-4 gap-4 py-6 flex  items-center  border"
          >
            {s.icon}
            <div className="flex flex-col">
              <span className="text-gray-600 ">{s.label}</span>
              <span className="text-2xl font-bold ">{s.value}</span>

            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between mt-6">
        {/* <Search /> */}
        <div className="flex items-center space-x-2 w-full border px-2 rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search destinations, lists..."
            className="w-100 border-none py-2 outline-none"
          />
        </div>
        <button className="ml-3 px-4 py-2 flex items-center bg-white gap-2 border rounded-md hover:bg-gray-100">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account" className="w-[400px] mt-6">
        <TabsList>
          <TabsTrigger value="account">My Lists</TabsTrigger>
          <TabsTrigger value="password">Shared with Me </TabsTrigger>
        </TabsList>
        <TabsContent value="account">Make changes to your account here.</TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>

      {/* Travel List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {travelLists.map((list, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
              [Image Placeholder]
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                {list.visibility === "Public" ? (
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4" /> Private
                  </span>
                )}
                {list.isNew && (
                  <span className="text-red-500 font-medium">New</span>
                )}
              </div>
              <h2 className="font-semibold text-lg">{list.title}</h2>
              <p className="text-gray-600 text-sm">{list.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
