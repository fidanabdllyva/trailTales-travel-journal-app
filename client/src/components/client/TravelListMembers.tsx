import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { getAllUsers } from "@/api/requests/userService"
import type { User } from "@/types/UserType"
import { addCollaborator } from "@/api/requests/travelListService"

interface Member {
  id: string
  fullName: string
  profileImage?: string
}

const TravelListMembers = ({ members, listId }: { members: Member[]; listId: string }) => {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      ;(async () => {
        try {
          const res = await getAllUsers()
          setUsers(res.data.data)
        } catch (err) {
          console.error("Failed to load users", err)
        }
      })()
    }
  }, [open])

  const handleInvite = async (email: string) => {
    try {
      setLoading(true)
      await addCollaborator(listId, email)
      setOpen(false)
    } catch (err) {
      console.error("Failed to add collaborator:", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Team Members</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Invite</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite a Collaborator</DialogTitle>
            </DialogHeader>

            <Command>
              <CommandInput
                placeholder="Search users..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandGroup heading="Users">
                  {filtered.map((u) => (
                    <CommandItem
                      key={u.id}
                      onSelect={() => handleInvite(u.email)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={u.profileImage} />
                          <AvatarFallback>
                            {u.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{u.fullName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="flex flex-wrap gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex flex-col items-center text-center w-24"
          >
            <Avatar className="w-12 h-12 mb-2">
              <AvatarImage src={m.profileImage} alt={m.fullName} />
              <AvatarFallback>
                {m.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{m.fullName}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TravelListMembers
