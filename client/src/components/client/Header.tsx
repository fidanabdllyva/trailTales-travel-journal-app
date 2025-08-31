import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, UserIcon, Users, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: userData, status: userStatus } = useSelector((state: RootState) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (token && isAuthenticated && userStatus === "idle") {
      // @ts-ignore
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, isAuthenticated, userStatus]);

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

  return (
    <header className="border-b px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src="/route.png" alt="TripCast icon" />
          </div>
          <span className="font-bold text-xl">
            Trail<span className="text-purple-500">Tales</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-7 text-md font-medium text-muted-foreground">
          <NavLink to="/dashboard" className="hover:text-purple-800 transition">Dashboard</NavLink>
          <NavLink to="/my-lists" className="hover:text-purple-800 transition">My Lists</NavLink>
          <NavLink to="/my-journals" className="hover:text-purple-800 transition">My Journals</NavLink>
          <NavLink to="/explore" className="hover:text-purple-800 transition">Explore</NavLink>
        </nav>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/travel-list/create" className="flex items-center">
            <Button className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.fullName ?? "User"}
                  className="w-8 h-8 object-cover rounded-full"
                />
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
                <Link to="/requests" className="w-full px-4 py-2 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Collaborator Requests</span>
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="flex flex-col md:hidden mt-4 space-y-2 text-md font-medium text-muted-foreground">
          <NavLink onClick={() => setMenuOpen(false)} to="/dashboard" className="hover:text-purple-800 transition">Dashboard</NavLink>
          <NavLink onClick={() => setMenuOpen(false)} to="/my-lists" className="hover:text-purple-800 transition">My Lists</NavLink>
          <NavLink onClick={() => setMenuOpen(false)} to="/my-journals" className="hover:text-purple-800 transition">My Journals</NavLink>
          <NavLink onClick={() => setMenuOpen(false)} to="/explore" className="hover:text-purple-800 transition">Explore</NavLink>
          <Link to="/travel-list/create" onClick={() => setMenuOpen(false)} className="flex items-center mt-2">
            <Button className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-full justify-center">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
