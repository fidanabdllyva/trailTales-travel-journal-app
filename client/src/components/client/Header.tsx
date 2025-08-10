import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Plus, Search, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "@/api/requests/authService";
import { logoutUser } from "@/redux/features/authSlice";
import { fetchUserProfile } from "@/redux/features/userSlice";
import type { RootState } from "@/redux/store";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { data: userData, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (token && isAuthenticated && userStatus === 'idle') {
      // @ts-ignore - Type issues with thunk actions can be ignored here
      dispatch(fetchUserProfile());
    }
  }, [ dispatch]);

  console.log(userData, "userData in Header");

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutUser());
      toast.success("Logged out");
      navigate("/", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  const notifications = [
    { title: "New collaborator joined", message: 'Sarah joined "European Adventure 2024"', time: "2 hours ago" },
    { title: "Trip reminder", message: "Barcelona trip is in 5 days!", time: "1 day ago" },
    { title: "Flight deal alert", message: "New deal for Tokyo flights!", time: "3 days ago" },
    { title: "Packing list shared", message: "Anna shared 'Iceland Essentials'", time: "5 days ago" },
    { title: "New comment", message: "Mike commented on your trip", time: "6 days ago" },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-4 border-b">
      <div className="flex items-center space-x-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src="/route.png" alt="TripCast icon" />
          </div>
          <span className="font-bold text-xl">
            Trail<span className="text-purple-500">Tales</span>
          </span>
        </div>
        <nav className="flex items-center space-x-7 text-md font-medium text-muted-foreground">
          <NavLink to="/dashboard" className="hover:text-purple-800 transition">
            Dashboard
          </NavLink>
          <NavLink to="/my-lists" className="hover:text-purple-800 transition">
            My Lists
          </NavLink>
          <NavLink to="/my-journals" className="hover:text-purple-800 transition">
            Journal
          </NavLink>
          <NavLink to="/explore" className="hover:text-purple-800 transition">
            Explore
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border px-2 rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0">
          <Search className="text-gray-800 w-5 h-5" />
          <input
            type="text"
            placeholder="Search destinations, lists..."
            className="w-100 border-none py-2 outline-none"
          />
        </div>

        <Link to={"/travel-list/create"} className="flex items-center">
          <Button className="flex items-center w-25 space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </Button>
        </Link>

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative align-center flex items-center justify-center hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                {notifications.length}
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={15}>
              <DropdownMenuLabel className="text-md font-semibold px-4 py-4 border-b">
                Notifications
              </DropdownMenuLabel>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((note, i) => (
                  <div key={i} className="px-4 py-3 border-b last:border-none">
                    <div className="font-semibold text-sm">{note.title}</div>
                    <div className="text-sm text-muted-foreground">{note.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{note.time}</div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
            {userData?.profileImage ? (
              <img src={userData.profileImage} alt={userData.fullName ?? "User"} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 rounded-lg shadow-md p-0" align="end" sideOffset={8}>
            <div className="px-4 py-3">
              <div className="text-sm font-medium text-black">{userData?.fullName || "User"}</div>
              <div className="text-sm text-muted-foreground font-semibold">{userData?.email}</div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full px-4 py-2 flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button className="w-full px-4 py-2 flex items-center space-x-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
