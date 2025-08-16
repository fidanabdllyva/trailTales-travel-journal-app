import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import TravelListSchema from "@/validations/travelListValidationSchema";
import DestinationSchema from "@/validations/destinationValidationSchema";
import { useState } from "react";

export default function CreateList() {
  const [tagInput, setTagInput] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tags: [],
      isPublic: true,
      coverImage: null,
      public_id: "",
      destinations: [],
      collaborators: "",
    },
    validationSchema: TravelListSchema,
    onSubmit: async (payload) => {
      try {
        console.log("Submitting payload:", payload);
        alert("Travel list created!");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <a href="#" className="text-muted-foreground hover:text-foreground">← Back to Dashboard</a>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">Create New Travel List</h1>
      <p className="mt-1 text-muted-foreground">Start planning your next adventure</p>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Card className="mt-6">
            <CardHeader>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="rounded-lg border border-dashed flex flex-col items-center justify-center gap-3 text-center relative">
                {formik.values.coverImage ? (
                  // Preview of uploaded image
                  <div className="h-60 w-full">
                    <img
                      src={URL.createObjectURL(formik.values.coverImage)}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded"
                    />

                  </div>
                ) : (
                  <>
                  <div className="p-20 flex-col flex items-center">

                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload a cover image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                  </>
                )}

                <Input
                  name="coverImage"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => formik.setFieldValue("coverImage", e.currentTarget.files?.[0] || null)}
                  onBlur={formik.handleBlur}
                />
              </div>

              {formik.errors.coverImage && formik.touched.coverImage && (
                <p className="text-sm text-red-500">{formik.errors.coverImage}</p>
              )}


              {/* Title */}
              <div className="space-y-2">
                <Label>List Title *</Label>
                <Input
                  name="title"
                  placeholder="e.g., European Adventure 2024"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.title && formik.touched.title && (
                  <p className="text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  placeholder="Describe your travel plans and what makes this trip special..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="text-sm text-red-500">{formik.errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag (e.g., adventure, culture, food)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
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
                  {formik.values.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        formik.setFieldValue(
                          "tags",
                          formik.values.tags.filter((_, i) => i !== index)
                        )
                      }
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
                {formik.errors.tags && formik.touched.tags && (
                  <p className="text-sm text-red-500">{formik.errors.tags}</p>
                )}
              </div>

              {/* Privacy */}
              <div className="space-y-3">
                <Label className="mb-1 block">Privacy Settings</Label>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Private List</p>
                      <p className="text-sm text-muted-foreground">
                        Only you and invited collaborators can view this list
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!formik.values.isPublic}
                    onCheckedChange={(checked) => formik.setFieldValue("isPublic", !checked)}
                  />
                </div>
                {formik.errors.isPublic && formik.touched.isPublic && (
                  <p className="text-sm text-red-500">{formik.errors.isPublic}</p>
                )}
              </div>

              {/* Collaborators */}
              <div className="space-y-2">
                <Label>Invite Collaborators</Label>
                <Input
                  name="collaborators"
                  placeholder="Enter email addresses (comma separated)"
                  value={formik.values.collaborators}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.collaborators && formik.touched.collaborators && (
                  <p className="text-sm text-red-500">{formik.errors.collaborators}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  You can invite more people after creating the list
                </p>
              </div>

              <Separator />

              {/* Destinations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Destinations</h3>
                  <FieldArray name="destinations">
                    {({ push }) => (
                      <Button type="button" variant="secondary" onClick={() => push({
                        location: { country: "", city: "" },
                        datePlanned: "",
                        dateVisited: "",
                        status: "wishlist",
                        notes: "",
                        image: { url: "", public_id: "" },
                        listId: "",
                      })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Destination
                      </Button>
                    )}
                  </FieldArray>
                </div>

                <FieldArray name="destinations">
                  {({ remove }) => (
                    <div className="space-y-6">
                      {formik.values.destinations.map((_, index) => (
                        <DestinationForm key={index} name={`destinations[${index}]`} index={index} />
                      ))}
                    </div>
                  )}
                </FieldArray>

                {formik.errors.destinations && formik.touched.destinations && (
                  <p className="text-sm text-red-500">{formik.errors.destinations}</p>
                )}
              </div>

            </CardContent>

            <CardFooter className="flex items-center pb-7 justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => formik.resetForm()}>
                Cancel
              </Button>
              <Button type="submit">Create List</Button>
            </CardFooter>
          </Card>
        </form>
      </FormikProvider>
    </div>
  );
}
