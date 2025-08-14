import * as Yup from "yup";

    
   export const editProfileValidationSchema = Yup.object({
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
        bio: Yup.string().max(300, "Bio can't be longer than 300 characters"),
    });