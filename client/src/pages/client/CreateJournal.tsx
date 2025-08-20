import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJournalEntry } from "@/api/requests/journalEntryService";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";

// Example mock data
const mockDestinations = [
  { country: "France", city: "Paris" },
  { country: "Italy", city: "Rome" },
  { country: "Japan", city: "Tokyo" },
];

const CreateJournal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    country: "",
    city: "",
    content: "",
    public: true,
    dateVisited: "",
    rating: 3,
  });
  const [photos, setPhotos] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (val: number) => {
    setForm({ ...form, rating: val });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("public", String(form.public));
      formData.append("location[country]", form.country);
      formData.append("location[city]", form.city);
      formData.append("dateVisited", form.dateVisited);
      formData.append("rating", String(form.rating));
      photos.forEach((photo) => formData.append("photos", photo));

      await createJournalEntry(formData);
      navigate("/my-journals");
    } catch (err) {
      console.error("Failed to create entry:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-8">
      {/* Left Content */}
      <div className="flex-1">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 mb-4 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-semibold mb-6">Write Journal Entry</h2>

        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Entry Title *</label>
            <Input
              name="title"
              placeholder="e.g., A Perfect Day in Paris"
              value={form.title}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm font-medium">Destination *</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1"
            >
              <option value="">Select a destination</option>
              {[...new Set(mockDestinations.map((d) => d.country))].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-2"
              disabled={!form.country}
            >
              <option value="">Select City</option>
              {mockDestinations
                .filter((d) => d.country === form.country)
                .map((d) => (
                  <option key={d.city} value={d.city}>
                    {d.city}
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
              value={form.dateVisited}
              onChange={handleChange}
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
                    star <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{form.rating}/5</span>
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="text-sm font-medium">Your Story *</label>
            <Textarea
              name="content"
              placeholder="Tell us about your experience..."
              value={form.content}
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Include specific details, emotions, and memorable moments to make your entry engaging!
            </p>
          </div>

          {/* Photos */}
          <div>
            <label className="text-sm font-medium">Photos</label>
            <div className="border-2 border-dashed rounded-md p-6 text-center mt-1">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photos"
              />
              <label htmlFor="photos" className="cursor-pointer text-gray-600">
                Upload Photos
              </label>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Privacy */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium mb-3">Privacy</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Public Entry</span>
            <Switch
              checked={form.public}
              onCheckedChange={(val) => setForm({ ...form, public: val })}
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium mb-3">Publishing</h3>
          <div className="flex flex-col gap-2">
            <Button onClick={handleSubmit}>Publish Entry</Button>
            <Button variant="outline">Save as Draft</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>

        {/* Writing Tips */}
        <div className="bg-white border rounded-lg shadow-sm p-4 text-sm">
          <h3 className="font-medium mb-2">Writing Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Include specific details about what you experienced</li>
            <li>Mention local food, people, or unique discoveries</li>
            <li>Describe how the place made you feel</li>
            <li>Add practical tips for future travelers</li>
            <li>Use photos to complement your story</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateJournal;
