import * as Yup from "yup";

export const resetPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmNewPassword: Yup.string()
     .oneOf([Yup.ref("newPassword")], "Passwords must match")
     .required("Confirm Password is required"),
});