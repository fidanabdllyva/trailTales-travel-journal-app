import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { getIn, type FormikProps } from "formik";
import type { DestinationType } from "@/types/DestinationType";
import mockCountries from "@/data/mockLocation";

interface DestinationFormProps {
  name: string;
  index: number;
  onRemove: (index: number) => void;
  formik: FormikProps<{
    destinations: (DestinationType & { image?: File | null; rating?: number })[];
  }>;
}

export default function DestinationForm({ name, index, onRemove, formik }: DestinationFormProps) {
  const destination = formik.values.destinations[index];

  // Helper to get nested errors
  const getError = (field: string) => getIn(formik.errors, field);
  const getTouched = (field: string) => getIn(formik.touched, field);

  const selectedCountry = mockCountries.find(c => c.name.en === destination.location.country);

  return (
    <Card className="p-4 space-y-2">
      {/* Country */}
      <div>
        <select
          value={destination.location.country || ""}
          onChange={(e) => {
            formik.setFieldValue(`${name}.location.country`, e.target.value);
            formik.setFieldValue(`${name}.location.city`, "");
          }}
          onBlur={formik.handleBlur}
          name={`${name}.location.country`}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Country</option>
          {mockCountries.map((c) => (
            <option key={c.code} value={c.name.en}>{c.name.en}</option>
          ))}
        </select>
        {getTouched(`${name}.location.country`) && getError(`${name}.location.country`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.location.country`)}</p>
        )}
      </div>

      {/* City */}
      <div>
        <select
          value={destination.location.city || ""}
          onChange={(e) => formik.setFieldValue(`${name}.location.city`, e.target.value)}
          onBlur={formik.handleBlur}
          name={`${name}.location.city`}
          className="border rounded p-2 w-full"
          disabled={!selectedCountry}
        >
          <option value="">Select City</option>
          {selectedCountry?.cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {getTouched(`${name}.location.city`) && getError(`${name}.location.city`) && (
          <p className="text-red-500 text-sm">{getError(`${name}.location.city`)}</p>
        )}
      </div>

      {/* Status */}
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

      {/* Date Planned: show if planned or completed */}
      {(destination.status === "planned" || destination.status === "completed") && (
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
      )}

      {/* Date Visited: show only if completed */}
      {destination.status === "completed" && (
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
      )}

      {/* Rating: show only if completed */}
      {destination.status === "completed" && (
        <div>
          <Input
            type="number"
            min={1}
            max={5}
            placeholder="Rating (1-5)"
            value={destination.rating || ""}
            onChange={(e) => formik.setFieldValue(`${name}.rating`, Number(e.target.value))}
            onBlur={formik.handleBlur}
            name={`${name}.rating`}
          />
          {getTouched(`${name}.rating`) && getError(`${name}.rating`) && (
            <p className="text-red-500 text-sm">{getError(`${name}.rating`)}</p>
          )}
        </div>
      )}

      {/* Notes */}
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

      {/* Image */}
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
