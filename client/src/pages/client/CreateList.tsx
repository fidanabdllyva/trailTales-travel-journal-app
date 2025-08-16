import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Upload, Trash } from "lucide-react";
import { createTravelList, addCollaborator } from "@/api/requests/travelListService";
import { createDestination } from "@/api/requests/destinationService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface UserType {
  id: string;
  email: string;
}

interface DestinationType {
  title: string;
  description?: string;
  country?: string;
  datePlanned?: string;
  status: string;
  images: File[];
}

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.array().of(Yup.string()),
  isPrivate: Yup.boolean(),
  collaborators: Yup.array().of(
    Yup.object({ id: Yup.string().required(), email: Yup.string().required() })
  ),
  destinations: Yup.array().of(
    Yup.object({
      title: Yup.string().required("Destination title is required"),
      description: Yup.string(),
      country: Yup.string().required("Country is required"),
      datePlanned: Yup.string().required("Planned date is required"),
      status: Yup.string().required(),
      images: Yup.array(),
    })
  ),
});

export default function CreateList() {
  const currentUserId = useSelector((s: RootState) => s.user.data?.id);
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Collaborator search
  const [collabSearch, setCollabSearch] = useState("");
  const [userResults, setUserResults] = useState<UserType[]>([]);

  // Local state for destination form
  const [destTitle, setDestTitle] = useState("");
  const [destDescription, setDestDescription] = useState("");
  const [destCountry, setDestCountry] = useState("");
  const [destDatePlanned, setDestDatePlanned] = useState("");
  const [destStatus, setDestStatus] = useState("planned");
  const [destImages, setDestImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  // Search collaborators


  const initialValues = {
    title: "",
    description: "",
    tags: [] as string[],
    isPrivate: false,
    collaborators: [] as UserType[],
    destinations: [] as DestinationType[],
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button variant="link" onClick={() => navigate("/dashboard")} className="mb-4">
        ← Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Travel List</CardTitle>
          <CardDescription>Plan your adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values) => {
              if (!coverImage) return alert("Cover image is required");

              try {
                setLoading(true);

                if (!currentUserId) {
                  alert("User not logged in");
                  return;
                }

                // 1️⃣ Create travel list
                const formData = new FormData();
                formData.append("coverImage", coverImage);
                formData.append("title", values.title);
                formData.append("description", values.description);
                values.tags.forEach((tag) => formData.append("tags[]", tag));
                formData.append("isPublic", (!values.isPrivate).toString());
                formData.append("owner", currentUserId);

                const newList = await createTravelList(formData);

                // 2️⃣ Add collaborators
                for (const collab of values.collaborators) {
                  await addCollaborator(newList.id, collab.id);
                }

                // 3️⃣ Create destinations
                for (const dest of values.destinations) {
                  const destForm = new FormData();
                  destForm.append("listId", newList.id);
                  destForm.append("name", dest.title); // map title -> name
                  destForm.append("description", dest.description || "");
                  destForm.append("country", dest.country || "");
                  destForm.append("datePlanned", dest.datePlanned || new Date().toISOString());
                  destForm.append("status", dest.status);
                  dest.images.forEach((img) => destForm.append("images", img));

                  await createDestination(destForm);
                }

                navigate(`/travel-list/${newList.id}`);
              } catch (err: any) {
                console.error("Error creating travel list:", err.response?.data || err.message);
                alert("Failed to create travel list");
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block font-medium mb-2">Cover Image *</label>
                  <div className="border-2 border-dashed p-4 text-center rounded-lg">
                    {coverImage ? (
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                    ) : (
                      <Upload className="mx-auto h-8 w-8 text-gray-500" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setCoverImage(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                {/* Title & Description */}
                <Input
                  placeholder="List Title *"
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />

                <Textarea
                  placeholder="Description *"
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />

                {/* Tags */}
                <FieldArray name="tags">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Add a tag"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                push(val);
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {values.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" onClick={() => remove(idx)}>
                            {tag} ✕
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </FieldArray>

                {/* Privacy */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={values.isPrivate}
                    onCheckedChange={(val) => setFieldValue("isPrivate", val)}
                  />
                  <span>Private List</span>
                </div>

                {/* Collaborators */}
                <div>
                  <label className="block font-medium mb-2">Invite Collaborators</label>
                  <Input
                    placeholder="Search users..."
                    value={collabSearch}
                    onChange={(e) => setCollabSearch(e.target.value)}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {userResults.map((user) => (
                      <Badge
                        key={user.id}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          if (!values.collaborators.find((c) => c.id === user.id)) {
                            setFieldValue("collaborators", [...values.collaborators, user]);
                          }
                          setCollabSearch("");
                          setUserResults([]);
                        }}
                      >
                        {user.email} +
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {values.collaborators.map((c, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        onClick={() =>
                          setFieldValue(
                            "collaborators",
                            values.collaborators.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        {c.email} ✕
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Destinations */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Add Destinations
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <FieldArray name="destinations">
                      {({ push, remove }) => (
                        <div>
                          <Input
                            placeholder="Destination Title *"
                            value={destTitle}
                            onChange={(e) => setDestTitle(e.target.value)}
                          />
                          <Textarea
                            placeholder="Destination Description"
                            value={destDescription}
                            onChange={(e) => setDestDescription(e.target.value)}
                          />
                          <Input
                            placeholder="Country *"
                            value={destCountry}
                            onChange={(e) => setDestCountry(e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="Planned Date *"
                            value={destDatePlanned}
                            onChange={(e) => setDestDatePlanned(e.target.value)}
                          />
                          <select
                            value={destStatus}
                            onChange={(e) => setDestStatus(e.target.value)}
                            className="border rounded p-2 w-full"
                          >
                            <option value="planned">Planned</option>
                            <option value="completed">Completed</option>
                            <option value="wishlist">Wishlist</option>
                          </select>
                          <Input
                            type="file"
                            multiple
                            onChange={(e) =>
                              e.target.files &&
                              setDestImages([...destImages, ...Array.from(e.target.files)])
                            }
                          />
                          <div className="flex gap-2 flex-wrap mt-2">
                            {destImages.map((img, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDestImages(destImages.filter((_, i) => i !== idx))
                                  }
                                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              if (!destTitle.trim() || !destCountry || !destDatePlanned) return;
                              push({
                                title: destTitle,
                                description: destDescription,
                                country: destCountry,
                                datePlanned: destDatePlanned,
                                status: destStatus,
                                images: destImages,
                              });
                              setDestTitle("");
                              setDestDescription("");
                              setDestCountry("");
                              setDestDatePlanned("");
                              setDestStatus("planned");
                              setDestImages([]);
                            }}
                          >
                            Add Destination
                          </Button>

                          {/* Existing destinations */}
                          {values.destinations.map((dest, idx) => (
                            <Card key={idx} className="p-4 flex justify-between mt-2">
                              <div>
                                <p className="font-bold">{dest.title}</p>
                                <p className="text-sm">{dest.description}</p>
                                <p className="text-xs text-gray-500">
                                  {dest.country} | {dest.datePlanned} | {dest.status}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => remove(idx)}
                              >
                                <Trash size={16} />
                              </Button>
                            </Card>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </CollapsibleContent>
                </Collapsible>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create List"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
