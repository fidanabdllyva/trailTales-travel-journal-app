import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  fullName: Yup.string()
    .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, "Full Name can only contain letters and spaces")
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must be at most 50 characters")
    .required("Full Name is required"),

  username: Yup.string()
    .matches(/^[a-z][a-z0-9_]*$/, "Username must start with a letter and can only contain lowercase letters, numbers, and underscores")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
