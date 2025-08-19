import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getAllUsers } from "@/api/requests/userService";
import { addCollaborator, removeCollaborator } from "@/api/requests/travelListService";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { TravelListType } from "@/types/TravelListType";
import type { User } from "@/types/UserType";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TravelListMembersProps {
  members: User[];
  list: TravelListType;
}

const TravelListMembers = ({ members, list }: TravelListMembersProps) => {
  const { owner, id: listId } = list;
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [teamMembers, setTeamMembers] = useState<User[]>([owner, ...members]); // <-- local state for instant UI update

  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const res = await getAllUsers();
          setUsers(res.data.data);
        } catch (err) {
          console.error("Failed to load users", err);
          toast.error("Failed to load users");
        }
      })();
    }
  }, [open]);

  const handleInvite = async (email: string, id: string) => {
    try {
      setLoadingUser(id);
      await addCollaborator(listId, email);
      toast.success("Invitation sent successfully");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add collaborator:", err);
      toast.error("Failed to send invitation");
    } finally {
      setLoadingUser(null);
    }
  };

  const handleRemove = async () => {
    if (!selectedUser) return;
    try {
      setRemovingUserId(selectedUser.id);
      await removeCollaborator(listId, selectedUser.id);
      toast.success("Collaborator removed");
      setTeamMembers((prev) => prev.filter((m) => m.id !== selectedUser.id));
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
      toast.error("Failed to remove collaborator");
    } finally {
      setRemovingUserId(null);
    }
  };


  const filtered = users.filter(
    (u) => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const disabledIds = new Set([...teamMembers.map((m) => m.id), currentUserId]);

  return (
    <>
      <Card className="p-4">
        {/* Invite Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {list.owner.id === currentUserId ? <Button size="sm">Invite</Button> : null}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite a Collaborator</DialogTitle>
              </DialogHeader>

              <Command>
                <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} />
                <CommandList className="max-h-64 overflow-y-auto">
                  <CommandGroup heading="Users">
                    {filtered.map((u) => {
                      const disabledBase = disabledIds.has(u.id);
                      const hasPendingRequest = u.collaboratorRequests?.some(
                        (req) => req.travelList === listId && req.status === "pending"
                      );
                      const disabled = disabledBase || hasPendingRequest;
                      const isLoading = loadingUser === u.id;

                      let statusLabel: string | null = null;
                      if (isLoading) statusLabel = "Loading...";
                      else if (hasPendingRequest) statusLabel = "Request Pending";
                      else if (u.id === owner.id) statusLabel = "Owner";
                      else if (disabledBase) statusLabel = "Already Added";

                      return (
                        <CommandItem
                          key={u.id}
                          onSelect={() => !disabled && !isLoading && handleInvite(u.email, u.id)}
                          className={`flex items-center justify-between ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={u.profileImage} />
                              <AvatarFallback>
                                {u.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{u.fullName}</span>
                          </div>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs text-muted-foreground">{statusLabel ?? u.email}</span>}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members Grid */}
        <CardContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 max-h-72 overflow-y-auto">
          {teamMembers.map((m) => (
            <div key={m.id} className="relative flex flex-col items-center text-center w-24 group">
              <Avatar className="w-12 h-12 mb-2 relative">
                <AvatarImage src={m.profileImage} alt={m.fullName} />
                <AvatarFallback>{m.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}</AvatarFallback>

                {/* Full overlay X button */}
                {m.id !== owner.id && list.owner.id === currentUserId && (
                  <button
                    onClick={() => { setSelectedUser(m); setConfirmDialogOpen(true); }}
                    disabled={removingUserId === m.id}
                    className="absolute inset-0 w-full h-full cursor-pointer bg-red-600 bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    {removingUserId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-6 h-6" />}
                  </button>
                )}
              </Avatar>
              <span className="text-sm font-medium">{m.fullName}</span>
              {m.id === owner.id && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  Owner
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shadcn AlertDialog for confirmation */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Collaborator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedUser?.fullName} from this travel list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
              disabled={removingUserId !== null} // disable button while removing
            >
              {removingUserId === selectedUser?.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


export default TravelListMembers;
