
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const LoginForm = () => {
      const [showPassword, setShowPassword] = useState(false)
  return (
    <form>
                  <input
                    type="email"
                    placeholder="Email address"
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
                    className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
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
  )
}

export default LoginForm