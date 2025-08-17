import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useFormikContext } from "formik";
import type { DestinationType } from "@/types/DestinationType";
import { Textarea } from "../ui/textarea";

interface DestinationFormProps {
  name: string;
  index: number;
  onRemove: (index: number) => void;
}

export default function DestinationForm({ name, index, onRemove }: DestinationFormProps) {
  const { values, setFieldValue } = useFormikContext<{ destinations: (DestinationType & { image?: File | null })[] }>();
  const destination = values.destinations[index];

  return (
    <Card className="p-4 space-y-2">
      <Input
        placeholder="Country *"
        value={destination.location.country}
        onChange={(e) => setFieldValue(`${name}.location.country`, e.target.value)}
      />
      <Input
        placeholder="City *"
        value={destination.location.city}
        onChange={(e) => setFieldValue(`${name}.location.city`, e.target.value)}
      />
      <Input
        type="date"
        value={destination.datePlanned || ""}
        onChange={(e) => setFieldValue(`${name}.datePlanned`, e.target.value)}
      />
      <Input
        type="date"
        value={destination.dateVisited || ""}
        onChange={(e) => setFieldValue(`${name}.dateVisited`, e.target.value)}
      />
      <select
        className="border rounded p-2 w-full"
        value={destination.status}
        onChange={(e) => setFieldValue(`${name}.status`, e.target.value)}
      >
        <option value="wishlist">Wishlist</option>
        <option value="planned">Planned</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <Textarea
        placeholder="Notes"
        value={destination.notes || ""}
        onChange={(e) => setFieldValue(`${name}.notes`, e.target.value)}
      />

      {/* Image Upload */}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (!file) return;
          setFieldValue(`${name}.image`, file);
        }}
      />

      {destination.image && (
        <img
          src={URL.createObjectURL(destination.image)}
          alt="Preview"
          className="h-24 w-24 object-cover rounded"
        />
      )}

      {/* Remove button */}
      <Button type="button" variant="destructive" onClick={() => onRemove(index)}>
        <Trash size={16} /> Remove
      </Button>
    </Card>
  );
}
