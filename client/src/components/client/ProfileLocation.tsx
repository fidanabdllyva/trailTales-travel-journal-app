import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import { MapPin } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../common/LoadingSpinner";
import mockCountries from "@/data/mockLocation";
import { updateUser as updateUserAction } from "@/redux/features/userSlice";
import { updateUser as updateUserService } from "@/api/requests/userService";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const ProfileLocation = () => {
  const dispatch = useDispatch();
  const { data: user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const [selectedCountry, setSelectedCountry] = useState("");

  if (userStatus === "loading") return <LoadingSpinner />;
  if (!user) return <div>No user data found.</div>;

  const hasLocation = Boolean(user?.location?.city && user?.location?.country);

  const handleRemoveLocation = async () => {
    try {
      const formData = new FormData();
      formData.append('location[city]', '');
      formData.append('location[country]', '');

      if (!user.id) throw new Error("User ID is missing");
      const response = await updateUserService(user.id as string, formData);
      toast.success("Location removed successfully")
      dispatch(updateUserAction(response.data.data));
    } catch (error) {
      console.error("Failed to remove location:", error);
      toast.error("Failed to remove location")
    }
  };

  const initialValues = {
    country: user.location?.country || "",
    city: user.location?.city || "",
  };

  const validationSchema = Yup.object().shape({
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const { country, city } = values;

    const selected = mockCountries.find((c) => c.name.en === country);
    if (!selected?.cities.includes(city)) {
      toast.error("Please select a valid city for the selected country");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('location[country]', country);
      formData.append('location[city]', city);

      if (!user.id) throw new Error("User ID is missing");
      const response = await updateUserService(user.id as string, formData);
      toast.success("Location added successfully")
      dispatch(updateUserAction(response.data.data));

      // Close the dialog
      const backdrop = document.querySelector('[data-state="open"]');
      if (backdrop) (backdrop as HTMLElement).click();
    } catch (error) {
      console.error("Failed to update location:", error);
      toast.error("Failed to update location")
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <MapPin className="w-4 h-4" />
      {hasLocation ? (
        <div className="group flex items-center gap-1 relative">
          <span>
            {user.location?.city}, {user.location?.country}
          </span>
          <button
            onClick={handleRemoveLocation}
            className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-700 ml-2"
            title="Remove location"
          >
            <FaTimes size={12} />
          </button>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
            + Add location
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Your Location
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Enter your country and city
              </DialogDescription>
            </DialogHeader>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="mt-4 flex flex-col gap-4">
                  {/* Country */}
                  <div className="flex flex-col">
                    <label htmlFor="country" className="text-sm font-medium mb-1">
                      Country
                    </label>
                    <Field
                      as="select"
                      id="country"
                      name="country"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                      value={values.country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setFieldValue("country", e.target.value);
                        setFieldValue("city", ""); // reset city when country changes
                        setSelectedCountry(e.target.value);
                      }}
                    >
                      <option value="">Select a country</option>
                      {mockCountries.map((country) => (
                        <option key={country.code} value={country.name.en}>
                          {country.name.en}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col">
                    <label htmlFor="city" className="text-sm font-medium mb-1">
                      City
                    </label>
                    <Field
                      as="select"
                      id="city"
                      name="city"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    >
                      <option value="">Select a city</option>
                      {mockCountries
                        .find((c) => c.name.en === selectedCountry)
                        ?.cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 bg-black text-white rounded-lg px-4 py-2 hover:bg-black/70 cursor-pointer transition"
                  >
                    {isSubmitting ? "Saving..." : "Save Location"}
                  </button>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileLocation;
