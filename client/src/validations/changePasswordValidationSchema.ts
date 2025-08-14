import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("Current password is required")
        .min(6, "Password must be at least 6 characters"),
    newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters")
        .notOneOf([Yup.ref("currentPassword")], "New password must be different"),
    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});