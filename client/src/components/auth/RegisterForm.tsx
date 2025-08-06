import { useState } from "react"
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"


const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <form >
            {/* Full Name */}
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            {/* Username */}
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Username"
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
                className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
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
    )
}

export default RegisterForm