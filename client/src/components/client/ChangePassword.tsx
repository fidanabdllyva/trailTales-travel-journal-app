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
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { changePasswordApi} from "@/api/requests/userService";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { changePasswordValidationSchema } from "@/validations/changePasswordValidationSchema";


const ChangePassword = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 cursor-pointer">
                    <LockKeyhole className="w-4 h-4" />
                    Change Password
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and a new password to update it.
                    </DialogDescription>
                </DialogHeader>

                <Formik
                    initialValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validationSchema={changePasswordValidationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            await changePasswordApi({
                                currentPassword: values.currentPassword,
                                newPassword: values.newPassword,
                            });
                            toast.success("Password updated successfully");
                            resetForm();
                            setIsOpen(false);
                        } catch (error: any) {
                            toast.error(error.response?.data?.message || "Failed to update password");
                        } finally {
                            setSubmitting(false);
                        }
                    }}

                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <Label htmlFor="currentPassword" className="mb-1">Current Password</Label>
                                <Field
                                    as={Input}
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    placeholder="Enter current password"
                                />
                                <ErrorMessage
                                    name="currentPassword"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <Label htmlFor="newPassword" className="mb-1">New Password</Label>
                                <Field
                                    as={Input}
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                />
                                <ErrorMessage
                                    name="newPassword"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label htmlFor="confirmPassword" className="mb-1">Confirm New Password</Label>
                                <Field
                                    as={Input}
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Updating..." : "Update Password"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;
