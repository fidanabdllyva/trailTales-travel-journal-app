"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Settings} from "lucide-react";
import { toast } from "sonner";
import { deleteTravelList } from "@/api/requests/travelListService";
import EditTravelListDialog from "./EditListDialog";

interface TravelListSettingsProps {
  listId: string;
  userId: string;
  ownerId: string;
  isCollaborator: boolean;
  onDeleted?: () => void; // callback to refresh lists after deletion
  onUpdated?: (data: any) => void; // callback after edit
}

const TravelListSettings: React.FC<TravelListSettingsProps> = ({
  listId,
  userId,
  ownerId,
  isCollaborator,
  onDeleted,
  onUpdated,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTravelList(listId);
      toast.success("Travel list deleted successfully");
      onDeleted?.();
      setIsDeleteDialogOpen(false); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete travel list");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="hover:bg-white/80 bg-muted/95 text-gray-900 flex items-center rounded-md px-2">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DialogTrigger>

        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Travel List Settings</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {(userId === ownerId) && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete List"}
              </Button>
            )}

            {(userId === ownerId || isCollaborator) && (
              <Button
                variant="default"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit List
              </Button>
            )}
          </div>

          {/* Edit Dialog */}
          <EditTravelListDialog
            listId={listId}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onUpdated={onUpdated}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this travel list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TravelListSettings;
