
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import { login } from '@/api/requests/authService';
import { loginValidationSchema } from '@/validations/loginValidationSchema';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/api/constants';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (credentials) => {
      try {
        const response = await login(credentials)
        if (credentials.rememberMe) {
          localStorage.setItem('token', response.data.accessToken) 
        } else {
          sessionStorage.setItem('token', response.data.accessToken)
        }
        toast.success(response.data.message || "Login successful!")
        navigate('/dashboard') 

      } catch (error: any) {
        console.error("Login failed:", error)
        toast.error(error.message || "Login failed. Please try again.")
      }
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mb-2'>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Email address"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {formik.errors.email && formik.touched.email && (
          <p className="text-sm text-red-500 ">{formik.errors.email}</p>
        )}
      </div>

      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
        {formik.errors.password && formik.touched.password && (
          <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            className="accent-blue-500"
          />

          Remember me
        </label>
        <Link
          to="/forgot-password"
          className="text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
        className="w-full bg-gradient-to-r cursor-pointer disabled:cursor-not-allowed from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        {formik.isSubmitting ? "Logging in..." : "Login"}
      </button>

      <div className="my-4 text-sm text-gray-400">
        OR CONTINUE WITH
      </div>

      <button
        type="button"
        onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
        className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 text-sm font-medium gap-2 hover:bg-gray-50"
      >
        <FaGoogle /> Continue with Google
      </button>
    </form>
  )
}

export default LoginForm