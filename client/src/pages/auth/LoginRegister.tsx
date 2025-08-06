import { useState } from "react"
import { Link } from "react-router-dom"
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

function LoginRegister() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {/* Logo and Title */}
                <div className="mb-6">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        🌍
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">TrailTales</h1>
                    <p className="text-sm text-gray-500">
                        Your travel companion for life&apos;s adventures
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden min-h-[450px]">
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

                    {/* Animated Form Container */}
                    <AnimatePresence mode="wait" initial={false}>
                        {activeTab === "login" && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-lg font-semibold mb-1">Welcome back!</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Sign in to continue your journey
                                </p>

                                <form>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <div className="relative mb-3">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-gray-500"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="accent-blue-500" />
                                            Remember me
                                        </label>
                                        <Link
                                            to="/auth/forgot-password"
                                            className="text-blue-500 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
                                    >
                                        Sign In
                                    </button>

                                    <div className="my-4 text-sm text-gray-400">
                                        OR CONTINUE WITH
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 text-sm font-medium gap-2 hover:bg-gray-50"
                                    >
                                        <FaGoogle /> Continue with Google
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "register" && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-lg font-semibold mb-1">Create account</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Start your travel journey today
                                </p>

                                <form>
                                    {/* Full Name */}
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="relative mb-3">
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative mb-3">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-gray-500"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="relative mb-3">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-gray-500"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    {/* Terms Agreement */}
                                    <div className="flex items-start text-sm text-gray-600 mb-4">
                                        <input
                                            type="checkbox"
                                            className="mr-2 mt-1 accent-blue-500"
                                            required
                                        />
                                        <span>
                                            I agree to the{" "}
                                            <a href="#" className="text-blue-600 hover:underline">
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a href="#" className="text-blue-600 hover:underline">
                                                Privacy Policy
                                            </a>
                                        </span>
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
                                    >
                                        Create Account
                                    </button>

                                    {/* Divider */}
                                    <div className="my-4 text-sm text-gray-400 text-center">
                                        OR CONTINUE WITH
                                    </div>

                                    {/* Google Login */}
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 text-sm font-medium gap-2 hover:bg-gray-50"
                                    >
                                        <FaGoogle /> Continue with Google
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister