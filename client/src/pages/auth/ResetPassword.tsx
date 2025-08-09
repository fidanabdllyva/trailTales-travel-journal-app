import { useFormik } from "formik";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { resetPasswordValidationSchema } from "@/validations/resetPasswordValidation";
import { resetPassword } from "@/api/requests/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface DecodedToken {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const { decoded, hasError } = useMemo(() => {
    let decoded: DecodedToken | undefined;
    let hasError = false;
    if (token) {
      try {
        decoded = jwtDecode<DecodedToken>(token);
      } catch {
        hasError = true;
      }
    } else {
      hasError = true;
    }
    return { decoded, hasError };
  }, [token]);

  useEffect(() => {
    if (hasError) {
      navigate("/");
    }
  }, [navigate, hasError]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, actions) => {
      try {
        if (!decoded?.email) {
          toast.error("Invalid reset link.");
          return;
        }
        const response = await resetPassword(decoded.email, values.newPassword);
        toast.success(response.data.message || "Password reset successfully!");
        navigate("/");
      } catch (error: any) {
        toast.error(error.message || "Failed to reset password.");
      }
      actions.resetForm();
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5 text-sm">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 
                ${formik.errors.newPassword && formik.touched.newPassword ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-sky-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.errors.newPassword && formik.touched.newPassword && (
              <span className="text-red-500 text-xs">
                {formik.errors.newPassword}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={formik.values.confirmNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 
                ${formik.errors.confirmNewPassword && formik.touched.confirmNewPassword ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-sky-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formik.errors.confirmNewPassword &&
              formik.touched.confirmNewPassword && (
                <span className="text-red-500 text-xs">
                  {formik.errors.confirmNewPassword}
                </span>
              )}
          </div>

          <button
            disabled={
              formik.isSubmitting ||
              !formik.dirty ||
              Object.keys(formik.errors).length > 0
            }
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer disabled:cursor-not-allowed from-cyan-400 via-purple-500 to-green-300 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
