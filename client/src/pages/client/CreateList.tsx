import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Upload, Globe } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import DestinationForm from "@/components/client/DestinationForm";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useState } from "react";
import { createTravelList, getTravelList } from "@/api/requests/travelListService";
import { createDestination } from "@/api/requests/destinationService";
import type { DestinationType } from "@/types/DestinationType";
import { travelListValidationSchema } from "@/validations/travelListValidationSchema";
import { useNavigate } from "react-router";

export default function CreateList() {
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [] as string[],
      isPublic: true,
      coverImage: null as File | null,
      destinations: [
        {
          location: { country: "", city: "" },
          datePlanned: "",
          dateVisited: "",
          status: "wishlist",
          notes: "",
          image: null,
          public_id: "",
          listId: "",
          rating: null
        }
      ],
    },
    validationSchema: travelListValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submitting travel list with values:", values);

        // --- 1️⃣ Create Travel List ---
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("isPublic", values.isPublic.toString());
        formData.append("tags", JSON.stringify(values.tags));
        if (values.coverImage) formData.append("coverImage", values.coverImage);

        const listResult = await createTravelList(formData);
        const listId = listResult.data.data.id;

        if (!listId) {
          console.error("No travel list ID returned. Cannot create destinations.");
          return;
        }

        // --- 2️⃣ Create Destinations ---
        const createdDestinations: any[] = [];

        for (const [index, dest] of values.destinations.entries()) {
          const destForm = new FormData();
          destForm.append("country", dest.location.country);
          destForm.append("city", dest.location.city);
          destForm.append("status", dest.status || "wishlist");

          // Append dates based on status
          if (dest.status === "planned" || dest.status === "completed") {
            destForm.append("datePlanned", dest.datePlanned);
          }
          if (dest.status === "completed" && dest.dateVisited) {
            destForm.append("dateVisited", dest.dateVisited);
          }

          // Append rating if completed
          if (dest.status === "completed" && dest.rating) {
            destForm.append("rating", String(dest.rating));
          }

          if (dest.notes) destForm.append("notes", dest.notes);
          destForm.append("listId", listId);
          if (dest.image) destForm.append("image", dest.image);

          const destResult = await createDestination(destForm);
          console.log(`Destination #${index + 1} created:`, destResult.data);

          createdDestinations.push(destResult.data);
        }




        alert(`Travel list created! ${createdDestinations.length} destinations saved.`);

        navigate(`/travel-list/${listId}`)

        // --- 4️⃣ Reset form & preview ---
        formik.resetForm();
        setPreviewUrl(null);

      } catch (err) {
        console.error("Failed to create travel list:", err);
        alert("Error creating travel list. Check console for details.");
      }
    }


    ,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Create New Travel List</h1>
      <p className="mt-1 text-muted-foreground">Start planning your next adventure</p>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card className="mt-6 py-6">
            <CardContent className="space-y-8">
              {/* Cover Image */}
              <div className="rounded-lg border border-dashed flex flex-col items-center justify-center gap-3 text-center relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Cover preview" className="h-60 w-full object-cover rounded" />
                ) : (
                  <div className="p-20 flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload a cover image</p>
                  </div>
                )}
                <Input
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (!file) return;
                    setPreviewUrl(URL.createObjectURL(file));
                    formik.setFieldValue("coverImage", file);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.coverImage && formik.errors.coverImage && (
                  <p className="text-red-500 text-sm">{formik.errors.coverImage}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <Label>List Title *</Label>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="European Adventure 2024"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm">{formik.errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe your travel plans..."
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm">{formik.errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        formik.setFieldValue("tags", [...formik.values.tags, tagInput.trim()]);
                        setTagInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {formik.values.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      onClick={() =>
                        formik.setFieldValue(
                          "tags",
                          formik.values.tags.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
                {formik.touched.tags && formik.errors.tags && (
                  <p className="text-red-500 text-sm">{formik.errors.tags}</p>
                )}
              </div>

              {/* Public / Private Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Visibility
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose whether your travel list will be visible to others
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!formik.values.isPublic ? (<Lock className="h-4 w-4"/>) : (<Globe className="h-4 w-4"/>)}
                  <Switch
                    id="isPublic"
                    name="isPublic"
                    checked={formik.values.isPublic}
                    onCheckedChange={(val) => formik.setFieldValue("isPublic", val)}
                  />
                  <span className="text-sm font-medium w-12">
                    {formik.values.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              {/* Destinations */}
              <FieldArray name="destinations">
                {({ push }) => (
                  <div className="space-y-4">
                    {formik.values.destinations.map((_, index) => (
                      <DestinationForm
                        key={index}
                        name={`destinations[${index}]`}
                        index={index}
                        formik={formik} // pass formik to DestinationForm to show errors
                        onRemove={(i) => formik.setFieldValue("destinations", formik.values.destinations.filter((_, idx) => idx !== i))}
                      />
                    ))}
                    {formik.touched.destinations && typeof formik.errors.destinations === "string" && (
                      <p className="text-red-500 text-sm">{formik.errors.destinations}</p>
                    )}
                    <Button type="button" onClick={() =>
                      push({
                        location: { country: "", city: "" },
                        datePlanned: "",
                        dateVisited: "",
                        status: "wishlist",
                        notes: "",
                        image: null,
                        public_id: "",
                        listId: "",
                      })
                    }>
                      <Plus className="mr-2 h-4 w-4" /> Add Destination
                    </Button>
                  </div>
                )}
              </FieldArray>


              <Separator />

            </CardContent>

            <CardFooter className="flex justify-end  gap-3">
              <Button type="button" variant="outline" onClick={() => formik.resetForm()}>Cancel</Button>
              <Button type="submit">
                {formik.isSubmitting ? "Creating..." : "Create List"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>
    </div>
  );
}
