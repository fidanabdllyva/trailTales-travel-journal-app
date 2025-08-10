// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import ClientLayout from "@/layouts/ClientLayout";

//Auth Pages
import ForgotPassword from "@/pages/auth/ForgotPassword";
import LoginRegister from "@/pages/auth/LoginRegister";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

//Common Pages
import NotFound from "@/pages/common/NotFound";

//Client Pages
import Dashboard from "@/pages/client/Dashboard";
import Explore from "@/pages/client/Explore";
import JournalDetail from "@/pages/client/JournalDetail";
import MyJournals from "@/pages/client/MyJournals";
import MyLists from "@/pages/client/MyLists";
import Profile from "@/pages/client/Profile";
import TravelList from "@/pages/client/TravelList";
import AuthCallback from "@/pages/auth/AuthCallback";
import CreateList from "@/pages/client/CreateList";
import ProtectedRoute from "@/components/client/ProtectedRoute";
import RedirectIfAuth from "@/components/auth/RedirectIfAuth";

const ROUTES = [
    //Auth Routes
    {
        path: "/",
        element:
        (
            <RedirectIfAuth>
                <AuthLayout />
            </RedirectIfAuth>
        ),
        children: [
            {
                index: true,
                element: <LoginRegister />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "success/:token",
                element: <AuthCallback />
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword />
            },
            {
                path: "email-verified",
                element: <VerifyEmail />
            }
        ]
    },

    //Client Routes
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ClientLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "explore",
                element: <Explore />
            },
            {
                path: "my-lists",
                element: <MyLists />
            },
            {
                path: "travel-list/:id",
                element: <TravelList />
            },
            {
                path: "travel-list/create",
                element: <CreateList />
            },
            {
                path: "my-journals",
                element: <MyJournals />
            },
            {
                path: "journal/:id",
                element: <JournalDetail />
            }
        ]
    },

    //not found
    {
        path: "*",
        element: <NotFound />
    }
]

export default ROUTES;