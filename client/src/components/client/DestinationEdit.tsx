"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFormik } from "formik";
import moment from "moment";
import type { DestinationType } from "@/types/DestinationType";
import { updateDestination } from "@/api/requests/destinationService";
import { editDestinationValidationSchema } from "@/validations/destinationValidationSchema";
import mockCountries from "@/data/mockLocation";


interface DestinationEditProps {
  destination: DestinationType;
  onUpdated?: (updated: DestinationType) => void;
}

const DestinationEdit = ({ destination: d, onUpdated }: DestinationEditProps) => {
  const [previewUrl, setPreviewUrl] = useState(d.image || null);
  const [cities, setCities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);


  const formik = useFormik({
    initialValues: {
      country: d.location.country,
      city: d.location.city,
      status: d.status,
      datePlanned: d.datePlanned ? moment(d.datePlanned).format("YYYY-MM-DD") : "",
      dateVisited: d.dateVisited ? moment(d.dateVisited).format("YYYY-MM-DD") : "",
      notes: d.notes || "",
      rating: d.rating || 5,
      image: null,
    },
    validationSchema: editDestinationValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("country", values.country);
        formData.append("city", values.city);
        formData.append("status", values.status);
        formData.append("datePlanned", values.datePlanned || "");
        formData.append("dateVisited", values.dateVisited || "");
        formData.append("notes", values.notes);
        formData.append("rating", String(values.rating));
        if (values.image) formData.append("image", values.image);

        const res = await updateDestination(d.id, formData);

        toast.success("Destination updated successfully");
        onUpdated?.(res);

         setOpen(false);
      } catch (err) {
        toast.error("Error updating destination");
      }
    },
  });

  // Update city options whenever the country changes
  useEffect(() => {
    const countryObj = mockCountries.find(c => c.name.en === formik.values.country);
    setCities(countryObj?.cities || []);
    if (!countryObj?.cities.includes(formik.values.city)) {
      formik.setFieldValue("city", "");
    }
  }, [formik.values.country]);

  return (
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Country */}
          <div>
            <Label>Country</Label>
            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select country</option>
              {mockCountries.map(c => (
                <option key={c.code} value={c.name.en}>{c.name.en}</option>
              ))}
            </select>
            {formik.errors.country && <p className="text-red-500">{formik.errors.country}</p>}
          </div>

          {/* City */}
          <div>
            <Label>City</Label>
            <select
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              disabled={!cities.length}
            >
              <option value="">Select city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {formik.errors.city && <p className="text-red-500">{formik.errors.city}</p>}
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="wishlist">Wishlist</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {(formik.values.status === "planned" || formik.values.status === "completed") && (
            <div>
              <Label>Date Planned</Label>
              <Input
                type="date"
                name="datePlanned"
                value={formik.values.datePlanned}
                onChange={formik.handleChange}
              />
              {formik.errors.datePlanned && <p className="text-red-500">{formik.errors.datePlanned}</p>}
            </div>
          )}

          {formik.values.status === "completed" && (
            <>
              <div>
                <Label>Date Visited</Label>
                <Input
                  type="date"
                  name="dateVisited"
                  value={formik.values.dateVisited}
                  onChange={formik.handleChange}
                />
                {formik.errors.dateVisited && <p className="text-red-500">{formik.errors.dateVisited}</p>}
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  name="rating"
                  min={1}
                  max={5}
                  value={formik.values.rating}
                  onChange={formik.handleChange}
                />
                {formik.errors.rating && <p className="text-red-500">{formik.errors.rating}</p>}
              </div>
            </>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (!file) return;
                setPreviewUrl(URL.createObjectURL(file));
                formik.setFieldValue("image", file);
              }}
            />
            {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 h-40 w-full object-cover rounded" />}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="submit"> {formik.isSubmitting ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationEdit;
