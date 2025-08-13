import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import { MapPin } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";

const ProfileLocation = () => {
  const { data: user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );

  if (userStatus === "loading") return <LoadingSpinner />;
  if (!user) return <div>No user data found.</div>;

  const hasLocation = Boolean(user?.location?.city && user?.location?.country);

  const handleRemoveLocation = () => {
    console.log("Remove location clicked");
    // TODO: dispatch Redux action or call API to remove location
  };

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <MapPin className="w-4 h-4" />
      {hasLocation ? (
        <div className="group flex items-center gap-1 relative">
          <span>
            {user.location?.city}, {user.location?.country}
          </span>
          <button
            onClick={handleRemoveLocation}
            className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-700 ml-2"
            title="Remove location"
          >
            <FaTimes size={12} />
          </button>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
            + Add location
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Your Location
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Enter your country and city
              </DialogDescription>
            </DialogHeader>

            <form className="mt-4 flex flex-col gap-4">
              {/* Country Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="text-sm font-medium mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Enter your country"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
              </div>

              {/* City Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="city"
                  className="text-sm font-medium mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 bg-black text-white rounded-lg px-4 py-2 hover:bg-black/70 cursor-pointer transition"
              >
                Save Location
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileLocation;
