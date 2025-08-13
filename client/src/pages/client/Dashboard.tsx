import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";

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
    // @ts-ignore - Type issues with thunk actions can be ignored here
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-purple-600">{userData?.fullName || "Traveler"}</span>
        </h1>
        {/* Add your dashboard content here */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add dashboard cards/widgets here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;