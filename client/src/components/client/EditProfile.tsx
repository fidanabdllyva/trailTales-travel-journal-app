import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react"
import { Textarea } from "../ui/textarea";

const EditProfile = () => {
    return (
        <>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="flex items-center gap-2 cursor-pointer">
                        <Pencil className="w-5 h-5" />
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="mb-1">Username</Label>
                            <Input
                                id="username"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="fullName" className="mb-1">Full Name</Label>
                            <Input
                                id="fullName"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="bio" className="mb-1">Bio</Label>
                            <Textarea
                                id="bio"
                                className="resize-none w-full min-h-[80px] h-auto"
                                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            />


                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditProfile