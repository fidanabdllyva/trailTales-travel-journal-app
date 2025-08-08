import { registerValidationSchema } from "@/validations/registerValidationSchema"
import { useState } from "react"
import { FaCheckCircle, FaEye, FaEyeSlash, FaGoogle, FaTimesCircle } from "react-icons/fa"
import { useFormik } from "formik"
import { toast } from 'sonner';
import { register } from "@/api/requests/authService";
import { API_BASE_URL } from "@/api/constants";
import { passwordRules, calculatePasswordStrength } from "@/utils/calculatePasswordStrength";


const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0);




    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(e);
        setPasswordStrength(calculatePasswordStrength(e.target.value));
    }


    const formik = useFormik({
        initialValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: registerValidationSchema,
        onSubmit: async (payload) => {
            try {
                const response = await register(payload)
                toast.success(response.data.message || "Registration successful!")

            } catch (error: any) {
                console.error("Login failed:", error)
                toast.error(error.message || "Login failed. Please try again.")
            }
        }
    })
    return (
        <form onSubmit={formik.handleSubmit} >
            {/* Full Name */}
            <div className="relative mb-3">
                <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {formik.errors.fullName && formik.touched.fullName && (
                    <p className="text-sm text-red-500">{formik.errors.fullName}</p>
                )}
            </div>

            {/* Username */}
            <div className="relative mb-3">
                <input
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {formik.errors.username && formik.touched.username && (
                    <p className="text-sm text-red-500">{formik.errors.username}</p>
                )}
            </div>

            {/* Email */}
            <div className="relative mb-3">
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {formik.errors.email && formik.touched.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
            </div>

            {/* Password */}
            <div className="relative mb-3">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={handlePasswordChange}
                    onBlur={formik.handleBlur}
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
                {formik.errors.password && formik.touched.password && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                )}
            </div>

{formik.values.password && (
  <>
    <div className="mt-1 h-2 rounded-full overflow-hidden bg-gray-200">
      <div
        style={{ width: `${(passwordStrength / 4) * 100}%` }}
        className={`h-2 transition-all duration-500 ${
          passwordStrength === 0
            ? "bg-gray-300"
            : passwordStrength === 1
            ? "bg-red-500"
            : passwordStrength === 2
            ? "bg-yellow-400"
            : passwordStrength === 3
            ? "bg-green-400"
            : "bg-green-600"
        }`}
      />
    </div>
    <p className="text-xs mt-1 mb-2 font-semibold text-gray-700">
      {["Very weak", "Weak", "Medium", "Strong", "Very strong"][passwordStrength]}
    </p>

    <div className="mt-2 space-y-1">
      {passwordRules.map((rule) => {
        const passed = rule.test(formik.values.password);
        return (
          <p
            key={rule.id}
            className={`flex items-center text-sm ${
              passed ? "text-green-600" : "text-red-600"
            } transition-colors duration-300`}
          >
            {passed ? (
            <FaCheckCircle
              className="mr-2 text-green-600 animate-pulse"
              aria-label="Passed"
            />
          ) : (
            <FaTimesCircle
              className="mr-2 text-red-600"
              aria-label="Failed"
            />
          )}
            {rule.label}
          </p>
        );
      })}
    </div>
  </>
)}



            {/* Confirm Password */}
            <div className="relative mt-3 mb-3">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.confirmPassword}</p>
                )}
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
                disabled={!formik.isValid || formik.isSubmitting}
                className="w-full bg-gradient-to-r cursor-pointer disabled:cursor-not-allowed from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
                Create Account
            </button>

            {/* Divider */}
            <div className="my-4 text-sm text-gray-400 text-center">
                OR CONTINUE WITH
            </div>

            {/* Google Login */}
            <button
                onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                type="button"
                className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 text-sm font-medium gap-2 hover:bg-gray-50"
            >
                <FaGoogle /> Continue with Google
            </button>
        </form>
    )
}

export default RegisterForm