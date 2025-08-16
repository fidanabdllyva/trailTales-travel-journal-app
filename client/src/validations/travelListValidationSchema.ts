import * as Yup from "yup";

const DestinationSchema = Yup.object().shape({
  location: Yup.object().shape({
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
  }),
  datePlanned: Yup.date().required("Planned date is required"),
});

const TravelListSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .max(1000, "Description cannot exceed 1000 characters"),

  tags: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one tag is required"),

  isPublic: Yup.boolean(),

  coverImage: Yup.mixed().required("Cover image is required"),

  public_id: Yup.string().optional(),

  collaborators: Yup.string()
    .trim()
    .nullable()
    .matches(
      /^(\s*[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}\s*,?\s*)*$/,
      "Collaborators must be valid emails, comma separated"
    )
    .optional(),

  destinations: Yup.array()
    .of(DestinationSchema)
    .min(1, "At least one destination is required"),

  chat: Yup.string().nullable().optional(),
});

export default TravelListSchema;
