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

  image: Yup.object().shape({
    url: Yup.string().required("Image URL is required").url("Must be a valid URL"),
    public_id: Yup.string().optional(),
  }).required("Image is required"),

  listId: Yup.string()
    .required("Travel list ID is required"),
});

export default DestinationSchema;
