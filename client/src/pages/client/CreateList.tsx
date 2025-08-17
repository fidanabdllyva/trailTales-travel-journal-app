import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Upload } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import DestinationForm from "@/components/client/DestinationForm";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useState } from "react";
import { createTravelList } from "@/api/requests/travelListService";
import { createDestination } from "@/api/requests/destinationService";
import type { DestinationType } from "@/types/DestinationType";

export default function CreateList() {
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [] as string[],
      isPublic: true,
      coverImage: null as File | null,
      destinations: [] as (DestinationType & { image?: File | null })[],
      collaborators: [] as string[],
    },
    onSubmit: async (values) => {
      try {
        // --- 1️⃣ Create Travel List ---
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("isPublic", values.isPublic.toString());
        formData.append("tags", JSON.stringify(values.tags));
        formData.append("collaborators", JSON.stringify(values.collaborators));
        if (values.coverImage) formData.append("coverImage", values.coverImage);

        const result = await createTravelList(formData);
        console.log("Travel list created:", result);

        if (!result?.data.data.id) {
          console.error("No travel list ID returned. Cannot create destinations.");
          return;
        }

        // --- 2️⃣ Create Destinations ---
        const createdDestinations: any[] = [];

        for (const [index, dest] of values.destinations.entries()) {
          try {
            const destForm = new FormData();
            destForm.append("country", dest.location.country);
            destForm.append("city", dest.location.city);
            destForm.append("datePlanned", dest.datePlanned);
            if (dest.dateVisited) destForm.append("dateVisited", dest.dateVisited);
            if (dest.status) destForm.append("status", dest.status);
            if (dest.notes) destForm.append("notes", dest.notes);
            destForm.append("listId", result.data.data.id);
            if (dest.image) destForm.append("image", dest.image);

            const destResult = await createDestination(destForm);
            console.log(`Destination #${index + 1} created:`, destResult);
            createdDestinations.push(destResult.data);
          } catch (err) {
            console.error(`Failed to create destination #${index + 1}:`, err);
          }
        }

        alert(`Travel list created! ${createdDestinations.length} destinations saved.`);

        // Reset form and preview
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
          <Card className="mt-6">
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
                />
              </div>

              {/* Title */}
              <div>
                <Label>List Title *</Label>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  placeholder="European Adventure 2024"
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Describe your travel plans..."
                />
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
                    <Badge key={i} variant="secondary" onClick={() => formik.setFieldValue("tags", formik.values.tags.filter((_, idx) => idx !== i))}>
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between p-4 border rounded">
                <Lock className="h-5 w-5" />
                <Switch
                  checked={!formik.values.isPublic}
                  onCheckedChange={(checked) => formik.setFieldValue("isPublic", !checked)}
                />
              </div>

              {/* Collaborators */}
              <FieldArray name="collaborators">
                {({ push, remove }) => (
                  <div>
                    {formik.values.collaborators.map((email, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input value={email} onChange={(e) => formik.setFieldValue(`collaborators[${idx}]`, e.target.value)} />
                        <Button type="button" onClick={() => remove(idx)}>Remove</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => push("")}>+ Add Collaborator</Button>
                  </div>
                )}
              </FieldArray>

              <Separator />

              {/* Destinations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Destinations</h3>
                  <FieldArray name="destinations">
                    {({ push }) => (
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
                    )}
                  </FieldArray>
                </div>

                {formik.values.destinations.map((_, index) => (
                  <DestinationForm
                    key={index}
                    name={`destinations[${index}]`}
                    index={index}
                    onRemove={(i) => formik.setFieldValue("destinations", formik.values.destinations.filter((_, idx) => idx !== i))}
                  />
                ))}

              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => formik.resetForm()}>Cancel</Button>
              <Button type="submit">Create List</Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>
    </div>
  );
}
