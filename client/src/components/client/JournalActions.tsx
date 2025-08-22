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
import { Button } from "../ui/button";
import { deleteJournalEntry } from "@/api/requests/journalEntryService";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { toast } from "sonner";
import EditJournalDialog from "./EditJournal";


interface JournalActionsProps {
  journal: JournalEntryType;
  onJournalUpdate?: (updatedJournal: JournalEntryType) => void;
}

const JournalActions = ({ journal, onJournalUpdate }: JournalActionsProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteJournalEntry(journal.id);
      toast.success("Journal deleted successfully!");
      setTimeout(() => {
        navigate(-1);
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

          <div className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
            <EditJournalDialog
              journalId={journal.id}
              onUpdate={(updatedJournal) => {
                toast.success("Journal updated!");
                if (onJournalUpdate) onJournalUpdate(updatedJournal);
              }}
            />
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
