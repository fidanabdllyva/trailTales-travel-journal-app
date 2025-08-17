import * as Yup from "yup";

const DestinationSchema = Yup.object().shape({
  location: Yup.object().shape({
    country: Yup.string()
      .trim()
      .required("Country is required"),
    city: Yup.string()
      .trim()
      .required("City is required"),
  }),

  datePlanned: Yup.date()
    .nullable()
    .optional(),

  dateVisited: Yup.date()
    .nullable()
    .optional(),

  status: Yup.string()
    .oneOf(['wishlist', 'planned', 'completed', 'cancelled'], "Invalid status")
    .required("Status is required"),

  notes: Yup.string()
    .trim()
    .optional(),

  // image: Yup.object().shape({
  //   url: Yup.string().required("Image URL is required").url("Must be a valid URL"),
  //   public_id: Yup.string().optional(),
  // }).required("Image is required"),

  listId: Yup.string()
    .required("Travel list ID is required"),
});

const TravelListSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required").max(100, "Title cannot exceed 100 characters"),
  description: Yup.string().trim().required("Description is required").max(1000, "Description cannot exceed 1000 characters"),
  tags: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required("Tag cannot be empty")
    )
    .min(1, "At least one tag is required")
  ,
  isPublic: Yup.boolean(),
  coverImage: Yup.mixed().test("fileRequired", "Cover image is required", (value) => value instanceof File).required(),
  public_id: Yup.string().optional(),
  collaborators: Yup.array().of(Yup.string().email("Invalid email").trim()).optional(),
  destinations: Yup.array().of(DestinationSchema).min(1, "At least one destination is required"),
  chat: Yup.string().nullable().optional(),
});


export default TravelListSchema;
