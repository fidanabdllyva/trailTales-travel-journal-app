import * as Yup from "yup";

export const editDestinationValidationSchema = Yup.object({
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  status: Yup.string()
    .oneOf(["wishlist", "planned", "completed", "cancelled"])
    .required("Status is required"),
  datePlanned: Yup.string().nullable().test(
    "datePlannedRequired",
    "Planned date is required",
    function (value) {
      const { status } = this.parent;
      if ((status === "planned" || status === "completed") && !value) return false;
      return true;
    }
  ),
  dateVisited: Yup.string().nullable().test(
    "dateVisitedRequired",
    "Visited date is required",
    function (value) {
      const { status } = this.parent;
      if (status === "completed" && !value) return false;
      return true;
    }
  ).test(
    "dateVisitedAfterPlanned",
    "Visited date must be after planned date",
    function (value) {
      const { datePlanned } = this.parent;
      if (value && datePlanned && value <= datePlanned) return false;
      return true;
    }
  ),
  rating: Yup.number().nullable().min(1).max(5).test(
    "ratingRequired",
    "Rating is required",
    function (value) {
      const { status } = this.parent;
      if (status === "completed" && (value === undefined || value === null)) return false;
      return true;
    }
  ),
  notes: Yup.string().trim(),
  image: Yup.mixed<File>().nullable(), // optional, old image is kept if not changed
});
