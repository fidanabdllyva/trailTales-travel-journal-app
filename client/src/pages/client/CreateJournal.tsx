import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { createJournalEntry as apiCreateJournalEntry } from "@/api/requests/journalEntryService";
import mockCountries from "@/data/mockLocation";
import { toast } from "sonner";

const MAX_PHOTOS = 10;

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  content: Yup.string().required("Story content is required"),
  dateVisited: Yup.date()
    .required("Date visited is required")
    .max(new Date(), "Date visited cannot be in the future"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
});

const CreateJournal = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);


  const formik = useFormik({
    initialValues: {
      title: "",
      country: "",
      city: "",
      content: "",
      dateVisited: "",
      rating: 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setPublishing(true);
      await handleSubmit(values, false);
      setSubmitting(false);
      setPublishing(false);
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const availableSlots = MAX_PHOTOS - photos.length;

    if (selectedFiles.length > availableSlots) {
      toast.error(`You can only upload ${availableSlots} more photo(s).`);
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);

    setPhotos([...photos, ...filesToAdd]);
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);

    if (filesToAdd.length > 0) {
      toast.success(`${filesToAdd.length} photo(s) added successfully!`);
    }

    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
    toast.success("Photo removed successfully!");
  };

  const handleSubmit = async (values: any, isDraft = false) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("dateVisited", values.dateVisited);
      formData.append("country", values.country);
      formData.append("city", values.city);
      formData.append("rating", String(rating));
      formData.append("public", String(!isDraft));

      photos.forEach((photo) => formData.append("photos", photo));

      await apiCreateJournalEntry(formData);

      toast.success(isDraft ? "Draft saved successfully!" : "Journal entry published!");
      navigate("/my-journals");
    } catch (err) {
      console.error("Failed to create entry:", err);
      toast.error("Failed to create entry. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-8">
      <div className="flex-1">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 mb-4 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold mb-6">Write Journal Entry</h2>

        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-sm font-medium">Entry Title *</label>
              <Input
                name="title"
                placeholder="e.g., A Perfect Day in Paris"
                className="mt-1"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="text-sm font-medium">Destination *</label>
              <select
                name="country"
                value={formik.values.country}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("city", "");
                }}
                onBlur={formik.handleBlur}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="">Select a country</option>
                {mockCountries.map((c) => (
                  <option key={c.code} value={c.name.en}>
                    {c.name.en}
                  </option>
                ))}
              </select>
              {formik.touched.country && formik.errors.country && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.country}</div>
              )}

              <select
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.country}
                className="w-full border rounded-md p-2 mt-2"
              >
                <option value="">Select City</option>
                {mockCountries
                  .find((c) => c.name.en === formik.values.country)
                  ?.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Date Visited *</label>
              <Input
                type="date"
                name="dateVisited"
                value={formik.values.dateVisited}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.dateVisited && formik.errors.dateVisited && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.dateVisited}</div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium">Overall Rating</label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    onClick={() => {
                      setRating(star);
                      formik.setFieldValue("rating", star);
                      toast.success(`Rating set to ${star}/5`);
                    }}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
              </div>
              {formik.touched.rating && formik.errors.rating && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.rating}</div>
              )}
            </div>

            {/* Story */}
            <div>
              <label className="text-sm font-medium">Your Story *</label>
              <Textarea
                name="content"
                placeholder="Tell us about your experience..."
                className="mt-1"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.content && formik.errors.content && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.content}</div>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="text-sm font-medium">Photos (max 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-1"
                disabled={photos.length >= MAX_PHOTOS}
              />
              {photos.length >= MAX_PHOTOS && (
                <p className="text-xs text-red-500 mt-1">Maximum {MAX_PHOTOS} photos reached</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {photos.length}/{MAX_PHOTOS} uploaded
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {photoPreviews.map((preview, i) => (
                  <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                    <img src={preview} alt="preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1"
                      onClick={() => removePhoto(i)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* Publish Entry */}
              <Button
                type="submit"
                disabled={formik.isSubmitting || savingDraft || publishing}
              >
                {publishing ? "Publishing..." : "Publish Entry"}
              </Button>

              {/* Save as Draft */}
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  // Trigger validation first
                  const valid = await formik.validateForm();
                  if (Object.keys(valid).length > 0) {
                    // There are validation errors, do not proceed
                    toast.error("Please fix form errors before saving draft.");
                    return;
                  }

                  setSavingDraft(true);
                  await handleSubmit(formik.values, true);
                  setSavingDraft(false);
                }}
                disabled={formik.isSubmitting || publishing || savingDraft}
              >
                {savingDraft ? "Saving..." : "Save as Draft"}
              </Button>

              <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJournal;
