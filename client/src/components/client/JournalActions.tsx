import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical } from "lucide-react";
import EditJournal from "./EditJournal";
import { Button } from "../ui/button";
import { deleteJournalEntry } from "@/api/requests/journalEntryService";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { toast } from "sonner";

interface JournalActionsProps {
  journal: JournalEntryType;
}

const JournalActions = ({ journal }: JournalActionsProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteJournalEntry(journal.id);
      toast.success("Journal deleted successfully!");
      
      // wait a tiny bit so the user sees the toast before navigating
      setTimeout(() => {
        navigate(-1); // go back to previous page
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete journal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <EllipsisVertical />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Journal Actions</DialogTitle>

          <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
            <EditJournal />
          </div>

          <Button onClick={handleDelete} variant="destructive" disabled={loading}>
            {loading ? "Deleting..." : "Delete Journal"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default JournalActions;
