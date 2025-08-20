"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Globe, Upload } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  getTravelList,
  updateTravelList,
} from "@/api/requests/travelListService";
import { editListValidationSchema } from "@/validations/travelListValidationSchema";

interface EditTravelListDialogProps {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (data: any) => void;
}

interface FormValues {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  coverImage: File | null;
}

const EditTravelListDialog: React.FC<EditTravelListDialogProps> = ({
  listId,
  open,
  onOpenChange,
  onUpdated,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      tags: [],
      isPublic: true,
      coverImage: null,
    },
    validationSchema: editListValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("isPublic", values.isPublic.toString());

        values.tags.forEach((tag) => formData.append("tags[]", tag));

        // Only append coverImage if it's a File (new upload)
        if (values.coverImage instanceof File) {
          formData.append("coverImage", values.coverImage);
        }

        const updatedList = await updateTravelList(listId, formData);
        toast.success("Travel list updated successfully");
        onUpdated?.(updatedList);
        onOpenChange(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update travel list");
      }
    },
  });

  // When fetching data
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const response = await getTravelList(listId);
        const data = response.data;

        formik.setValues({
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          isPublic: data.isPublic,
          coverImage: null, // keep null; user didn't upload a new file yet
        });

        // Preview URL for existing image
        if (data.coverImage) setPreviewUrl(data.coverImage);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch travel list data");
      }
    };

    fetchData();
  }, [listId, open]);


  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const tagRegex = /^[a-z0-9]+$/;
    if (!tagRegex.test(trimmedTag)) {
      toast.error("Tags must be lowercase, alphanumeric, no spaces or special characters");
      return;
    }

    if (!formik.values.tags.includes(trimmedTag)) {
      formik.setFieldValue("tags", [...formik.values.tags, trimmedTag]);
      setTagInput("");
    }
  };


  const handleRemoveTag = (tag: string) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((t) => t !== tag)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-6 space-y-6">
        <DialogHeader>
          <DialogTitle>Edit Travel List</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="relative w-full border border-dashed rounded-lg overflow-hidden hover:border-primary transition cursor-pointer">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Cover preview"
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
                <Upload className="w-10 h-10 mb-2" />
                <p>Upload a cover image</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
              rows={4}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {formik.touched.tags && formik.errors.tags && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.tags}</div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formik.values.tags.map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-white transition"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ✕
                </Badge>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <Label>Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Choose whether this travel list is public or private
              </p>
            </div>
            <div className="flex items-center gap-2">
              {formik.values.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              <Switch
                id="isPublic"
                checked={formik.values.isPublic}
                onCheckedChange={(val) => formik.setFieldValue("isPublic", val)}
              />
              <span className="ml-2 font-medium">{formik.values.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => formik.resetForm()}>
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTravelListDialog;
