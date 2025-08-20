import * as Yup from "yup";

export const destinationValidationSchema = Yup.object({
  location: Yup.object({
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
  }),

  status: Yup.string()
    .oneOf(["wishlist", "planned", "completed", "cancelled"])
    .required("Status is required"),

  datePlanned: Yup.date()
    .nullable()
    .typeError("Date must be valid")
    .test(
      "datePlannedRequired",
      "Planned date is required",
      function (value) {
        const { status } = this.parent;
        if ((status === "planned" || status === "completed") && !value) {
          return false;
        }
        return true;
      }
    ),

  dateVisited: Yup.date()
    .nullable()
    .typeError("Date must be valid")
    .test(
      "dateVisitedRequired",
      "Visited date is required",
      function (value) {
        const { status } = this.parent;
        if (status === "completed" && !value) return false;
        return true;
      }
    ),

  rating: Yup.number()
    .nullable()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .test(
      "ratingRequired",
      "Rating is required",
      function (value) {
        const { status } = this.parent;
        if (status === "completed" && (value === undefined || value === null)) {
          return false;
        }
        return true;
      }
    ),

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
  description: Yup.string().max(100, "Description cannot exceed 100 characters").trim(),
  tags: Yup.array().of(Yup.string()
    .matches(/^[a-z0-9]+$/, "Tags must be lowercase, alphanumeric, no spaces or special characters")
    .required("Tag cannot be empty")).min(1, "At least one tag is required"),
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
  destinations: Yup.array()
    .of(destinationValidationSchema)
    .min(1, "At least one destination is required")
    .required("Destinations are required"),
});


export const editListValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().max(100, "Description cannot exceed 100 characters").trim(),
  tags: Yup.array().of(Yup.string()
    .matches(/^[a-z0-9]+$/, "Tags must be lowercase, alphanumeric, no spaces or special characters")
    .required("Tag cannot be empty")).min(1, "At least one tag is required"),
  coverImage: Yup.mixed<File>()
    .required("Cover image is required")

});