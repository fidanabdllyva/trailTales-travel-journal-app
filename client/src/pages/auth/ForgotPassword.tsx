import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { forgotPasswordValidationSchema } from "@/validations/forgotPasswordValidation";
import { toast } from 'sonner';
import { forgotPassword } from "@/api/requests/authService";


const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values, actions) => {
      try {
        await forgotPassword(values.email);
        toast.success("Reset password email sent successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to send reset password email.");
      }

      actions.resetForm();
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5 text-sm">
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formik.values.email}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.errors.email && formik.touched.email && (
              <span className="text-red-500 text-sm">
                {formik.errors.email}
              </span>
            )}
          </div>

          <button
            disabled={
              formik.isSubmitting ||
              !formik.dirty ||
              Object.entries(formik.errors).length > 0
            }
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer disabled:cursor-not-allowed from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;