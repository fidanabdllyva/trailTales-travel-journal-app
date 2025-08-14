import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { updateUser as updateUserApi } from "@/api/requests/userService";
import { updateUser } from "@/redux/features/userSlice";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { editProfileValidationSchema } from "@/validations/editProfileValidationSchema";

const EditProfile = () => {
    const { data: user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

                <Formik
                    initialValues={{
                        username: user?.username || "",
                        fullName: user?.fullName || "",
                        bio: user?.bio || "",
                    }}
                    validationSchema={editProfileValidationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const form = new FormData();
                            Object.entries(values).forEach(([key, value]) => {
                                if (value) form.append(key, value);
                            });

                            if (user?.id) {
                                const response = await updateUserApi(user.id, form);
                                dispatch(updateUser(response.data.data));
                                toast.success("Profile updated successfully");
                                setIsOpen(false);
                            }
                        } catch (error: any) {
                            toast.error(error.message || "Failed to update profile");
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Username */}
                            <div>
                                <Label htmlFor="username" className="mb-1">Username</Label>
                                <Field
                                    as={Input}
                                    id="username"
                                    name="username"
                                    placeholder="Enter username"
                                />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <Label htmlFor="fullName" className="mb-1">Full Name</Label>
                                <Field
                                    as={Input}
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter full name"
                                />
                                <ErrorMessage
                                    name="fullName"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <Label htmlFor="bio" className="mb-1">Bio</Label>
                                <Field
                                    as={Textarea}
                                    id="bio"
                                    name="bio"
                                    placeholder="Write something about yourself"
                                    className="resize-none w-full min-h-[80px] h-auto"
                                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                                />
                                <ErrorMessage
                                    name="bio"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfile;
