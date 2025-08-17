import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { getIn, type FormikProps } from "formik";
import type { DestinationType } from "@/types/DestinationType";

interface DestinationFormProps {
  name: string;
  index: number;
  onRemove: (index: number) => void;
  formik: FormikProps<{
    destinations: (DestinationType & { image?: File | null })[];
  }>;
}

export default function DestinationForm({ name, index, onRemove, formik }: DestinationFormProps) {
  const destination = formik.values.destinations[index];

  // Helper to get nested errors
  const getError = (field: string) => getIn(formik.errors, field);
  const getTouched = (field: string) => getIn(formik.touched, field);

  return (
    <Card className="p-4 space-y-2">
      <div>
        <Input
          placeholder="Country *"
          value={destination.location.country}
          onChange={(e) => formik.setFieldValue(`${name}.location.country`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.location.country`}
        />
        {getTouched(`${name}.location.country`) && getError(`${name}.location.country`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.location.country`)}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="City *"
          value={destination.location.city}
          onChange={(e) => formik.setFieldValue(`${name}.location.city`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.location.city`}
        />
        {getTouched(`${name}.location.city`) && getError(`${name}.location.city`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.location.city`)}</p>
        )}
      </div>

      <div>
        <Input
          type="date"
          value={destination.datePlanned || ""}
          onChange={(e) => formik.setFieldValue(`${name}.datePlanned`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.datePlanned`}
        />
        {getTouched(`${name}.datePlanned`) && getError(`${name}.datePlanned`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.datePlanned`)}</p>
        )}
      </div>

      <div>
        <Input
          type="date"
          value={destination.dateVisited || ""}
          onChange={(e) => formik.setFieldValue(`${name}.dateVisited`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.dateVisited`}
        />
        {getTouched(`${name}.dateVisited`) && getError(`${name}.dateVisited`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.dateVisited`)}</p>
        )}
      </div>

      <div>
        <select
          className="border rounded p-2 w-full"
          value={destination.status}
          onChange={(e) => formik.setFieldValue(`${name}.status`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.status`}
        >
          <option value="wishlist">Wishlist</option>
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {getTouched(`${name}.status`) && getError(`${name}.status`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.status`)}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Notes"
          value={destination.notes || ""}
          onChange={(e) => formik.setFieldValue(`${name}.notes`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.notes`}
        />
        {getTouched(`${name}.notes`) && getError(`${name}.notes`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.notes`)}</p>
        )}
      </div>

      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;
            formik.setFieldValue(`${name}.image`, file);
          }}
          onBlur={formik.handleBlur}
          name={`${name}.image`}
        />
        {getTouched(`${name}.image`) && getError(`${name}.image`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.image`)}</p>
        )}
      </div>

      {destination.image && (
        <img
          src={URL.createObjectURL(destination.image)}
          alt="Preview"
          className="h-24 w-24 object-cover rounded"
        />
      )}

      <Button type="button" variant="destructive" onClick={() => onRemove(index)}>
        <Trash size={16} /> Remove
      </Button>
    </Card>
  );
}
