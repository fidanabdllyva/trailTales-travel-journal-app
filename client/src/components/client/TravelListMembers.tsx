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
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

interface Member {
  id: string
  fullName: string
  profileImage?: string
}

interface TravelListMembersProps {
  members: Member[]
  listId: string
  owner: User
}

const TravelListMembers = ({ members, listId, owner }: TravelListMembersProps) => {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const currentUserId = useSelector((s:RootState)=>s.user.data?.id)

  // include owner in members
  const teamMembers = [owner, ...members]

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

  // search filter
  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  // list of ids who are already collaborators or owner
  const disabledIds = new Set([...teamMembers.map((m) => m.id), currentUserId])

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
                  {filtered.map((u) => {
                    if(!u.id) return
                    const disabled = disabledIds.has(u.id)
                    return (
                      <CommandItem
                        key={u.id}
                        onSelect={() => !disabled && handleInvite(u.email)}
                        className={`flex items-center justify-between ${
                          disabled ? "opacity-50 pointer-events-none" : ""
                        }`}
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
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="flex flex-wrap gap-6">
        {teamMembers.map((m) => (
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
            {m.id === owner.id && (
              <Badge variant="secondary" className="mt-1 text-[10px]">
                Owner
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TravelListMembers
