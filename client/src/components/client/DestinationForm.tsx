import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FieldArray, useFormikContext } from "formik";
import DestinationSchema from "@/validations/destinationValidationSchema";
import type { DestinationType } from "@/types/DestinationType";
import { useState } from "react";



interface DestinationFormProps {
  name: string; // path in Formik values e.g., "destinations[0]"
  index: number;
}

export default function DestinationForm({ name, index }: DestinationFormProps) {
  const { values, errors, touched, setFieldValue } = useFormikContext<{ destinations: DestinationType[] }>();
  const [preview, setPreview] = useState<string>("");
  const destinationErrors = errors.destinations?.[index] as any;
  const destinationTouched = touched.destinations?.[index] as any;

  return (
    <Card className="p-4 space-y-2">
      {/* Notes */}
      <Textarea
        name={`${name}.notes`}
        placeholder="Notes"
        value={values.destinations[index].notes}
        onChange={(e) => setFieldValue(`${name}.notes`, e.target.value)}
      />
      {destinationErrors?.notes && destinationTouched?.notes && (
        <p className="text-sm text-red-500">{destinationErrors.notes}</p>
      )}

      {/* Country */}
      <Input
        name={`${name}.location.country`}
        placeholder="Country *"
        value={values.destinations[index].location.country}
        onChange={(e) => setFieldValue(`${name}.location.country`, e.target.value)}
      />
      {destinationErrors?.location?.country && destinationTouched?.location?.country && (
        <p className="text-sm text-red-500">{destinationErrors.location.country}</p>
      )}

      {/* City */}
      <Input
        name={`${name}.location.city`}
        placeholder="City *"
        value={values.destinations[index].location.city}
        onChange={(e) => setFieldValue(`${name}.location.city`, e.target.value)}
      />
      {destinationErrors?.location?.city && destinationTouched?.location?.city && (
        <p className="text-sm text-red-500">{destinationErrors.location.city}</p>
      )}

      {/* Date Planned */}
      <Input
        name={`${name}.datePlanned`}
        type="date"
        value={values.destinations[index].datePlanned ? new Date(values.destinations[index].datePlanned).toISOString().split("T")[0] : ""}
        onChange={(e) => setFieldValue(`${name}.datePlanned`, e.target.value)}
      />
      {destinationErrors?.datePlanned && destinationTouched?.datePlanned && (
        <p className="text-sm text-red-500">{destinationErrors.datePlanned}</p>
      )}



      {/* Date Visited */}
      <Input
        name={`${name}.dateVisited`}
        type="date"
        value={values.destinations[index].dateVisited ? new Date(values.destinations[index].dateVisited).toISOString().split("T")[0] : ""}
        onChange={(e) => setFieldValue(`${name}.dateVisited`, e.target.value)}
      />

      {destinationErrors?.dateVisited && destinationTouched?.dateVisited && (
        <p className="text-sm text-red-500">{destinationErrors.dateVisited}</p>
      )}

      {/* Status */}
      <select
        name={`${name}.status`}
        className="border rounded p-2 w-full"
        value={values.destinations[index].status}
        onChange={(e) => setFieldValue(`${name}.status`, e.target.value)}
      >
        <option value="wishlist">Wishlist</option>
        <option value="planned">Planned</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {destinationErrors?.status && destinationTouched?.status && (
        <p className="text-sm text-red-500">{destinationErrors.status}</p>
      )}

      <Input
        name={`${name}.image.file`}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // Show preview locally
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);

          // Upload to server / Cloudinary
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data?.url && data?.public_id) {
            // Save only url and public_id to Formik
            setFieldValue(`${name}.image.url`, data.url);
            setFieldValue(`${name}.image.public_id`, data.public_id);
          }
        }}
      />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-24 w-24 object-cover mt-2"
        />
      )}



      {/* Remove Destination */}
      <FieldArray name="destinations">
        {({ remove }) => (
          <Button type="button" variant="destructive" onClick={() => remove(index)}>
            <Trash size={16} /> Remove
          </Button>
        )}
      </FieldArray>
    </Card>
  );
}
