import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import {
  updateJournalEntry,
  getJournalEntryById,
  removePhoto as removePhotoAPI,
} from "@/api/requests/journalEntryService";
import mockCountries from "@/data/mockLocation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface EditJournalDialogProps {
  journalId: string;
  onUpdate?: (updatedJournal: any) => void; // callback to notify parent
}

const EditJournalDialog = ({ journalId, onUpdate }: EditJournalDialogProps) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

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
    onSubmit: async (values) => {
      await handleUpdate(values);
    },
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getJournalEntryById(journalId);
        const formattedDate = data.dateVisited
          ? new Date(data.dateVisited).toISOString().split("T")[0]
          : "";
        formik.setValues({
          title: data.title,
          country: data.location.country,
          city: data.location.city,
          content: data.content,
          dateVisited: formattedDate,
          rating: data.rating,
        });
        setRating(data.rating);
        setPhotoPreviews(data.photos || []);
      } catch (err) {
        console.error("Failed to load journal entry:", err);
        toast.error("Failed to load journal entry.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [journalId]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = MAX_PHOTOS - photos.length - photoPreviews.length;

    if (selectedFiles.length > availableSlots) {
      toast.error(`You can only upload ${availableSlots} more photo(s).`);
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);
    setPhotos([...photos, ...filesToAdd]);
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemovePhoto = async (index: number) => {
    const isExisting = index < photoPreviews.length - photos.length;

    if (isExisting) {
      const photo: any = photoPreviews[index];
      try {
        await removePhotoAPI(journalId, photo.url);
        toast.success("Existing photo removed from entry!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove photo.");
        return;
      }
    } else {
      setPhotos(photos.filter((_, i) => i !== index - (photoPreviews.length - photos.length)));
      toast.success("Photo removed successfully!");
    }
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleUpdate = async (values: any) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("dateVisited", values.dateVisited);
      formData.append("country", values.country);
      formData.append("city", values.city);
      formData.append("rating", String(rating));

      photos.forEach((photo) => formData.append("photos", photo));

      const updatedEntry = await updateJournalEntry(journalId, formData);


      if (onUpdate) onUpdate(updatedEntry);

      setOpen(false);
    } catch (err) {
      console.error("Failed to update entry:", err);
      toast.error("Failed to update entry. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Edit Journal</DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5 mt-4">
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
            </div>

            {/* Country/City */}
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
                  <option key={c.code} value={c.code}>
                    {c.name.en}
                  </option>
                ))}
              </select>

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
                  .find((c) => c.code === formik.values.country)
                  ?.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
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
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium">Overall Rating</label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
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
                disabled={photoPreviews.length >= MAX_PHOTOS || isUpdating}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {photoPreviews.map((preview: any, i) => (
                  <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                    <img src={preview.url || preview} alt="preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1"
                      onClick={() => handleRemovePhoto(i)}
                      disabled={isUpdating}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Entry"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditJournalDialog;
