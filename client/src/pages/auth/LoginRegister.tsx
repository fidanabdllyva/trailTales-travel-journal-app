import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

function LoginRegister() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "local_account_exists") {
      toast.error(
        "An account with this email already exists using local login. Please log in with your password."
      );
    } else if (error === "google_failed") {
      toast.error("Google login failed. Please try again.");
    }
  }, [error]);


  return (
    <>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 overflow-auto">
        <div className="w-full max-w-md text-center">
          {/* Logo and Title */}
          <div className="mb-6">
            <div className="w-18 h-18 mx-auto mb-4 rounded-full shadow-lg">
              <img
                src="/route.png"
                alt="Travel Icon"
                className="object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">TrailTales</h1>
            <p className="text-sm text-gray-500">
              Your travel companion for life&apos;s adventures
            </p>
          </div>

          {/* Card Container - Make height dynamic */}
          <motion.div
            layout
            className="bg-white rounded-xl shadow-md p-6 relative"
          >
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 font-medium transition ${activeTab === "login"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-400"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 font-medium transition ${activeTab === "register"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-400"
                  }`}
              >
                Register
              </button>
            </div>

            {/* Animated Form */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                layout
                initial={{ opacity: 0, x: activeTab === "login" ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "login" ? 40 : -40 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "login" ? (
                  <>
                    <h2 className="text-lg font-semibold mb-1">Welcome back!</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Sign in to continue your journey
                    </p>
                    <LoginForm />
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold mb-1">Create account</h2>
                    <p className="text-sm text-gray-500 mb-2">
                      Start your travel journey today
                    </p>
                    <RegisterForm />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default LoginRegister
