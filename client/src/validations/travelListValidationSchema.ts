import * as Yup from "yup";

// Destination schema
export const destinationValidationSchema = Yup.object().shape({
  location: Yup.object().shape({
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
  }),
  datePlanned: Yup.date().nullable().typeError("Date must be valid"),
  dateVisited: Yup.date().nullable().typeError("Date must be valid"),
  status: Yup.string()
    .oneOf(["wishlist", "planned", "completed", "cancelled"])
    .required("Status is required"),
  notes: Yup.string().trim(),
  image: Yup.mixed<File>()
    .required("Destination image is required")
    .test("fileSize", "File too large", (file) => !file || file.size <= 5 * 1024 * 1024)
    .test(
      "fileType",
      "Unsupported file format",
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)
    ),
});

// Travel List schema
export const travelListValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  tags: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  isPublic: Yup.boolean(),
  coverImage: Yup.mixed<File>()
    .required("Cover image is required")
    .test("fileSize", "File too large", (file) => !file || file.size <= 5 * 1024 * 1024)
    .test(
      "fileType",
      "Unsupported file format",
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)
    ),
  collaborators: Yup.array().of(
    Yup.string().email("Invalid collaborator email")
  ),
  destinations: Yup.array()
    .of(destinationValidationSchema)
    .min(1, "At least one destination is required")
    .required("Destinations are required"),
});
