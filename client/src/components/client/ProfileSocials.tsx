import type { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { updateUser as updateUserAction } from "@/redux/features/userSlice";
import { updateUser as updateUserService } from "@/api/requests/userService";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { socialsValidationSchemas } from '@/validations/socialsValidation';
import { toast } from 'sonner';

const ProfileSocials = () => {
    const dispatch = useDispatch();
    const { data: user, status: userStatus } = useSelector(
        (state: RootState) => state.user
    );

    if (userStatus === "loading") return <LoadingSpinner />;
    if (!user) return <div>No user data found.</div>;

    const handleAddSocialLink = async (platform: 'linkedin' | 'instagram' | 'x', value: string) => {
        try {
            const formData = new FormData();
            let socialValue = value.trim();

            if (platform === 'linkedin') {
                if (!socialValue.startsWith('http')) {
                    socialValue = `https://linkedin.com/in/${socialValue}`;
                }
            } else {
                socialValue = socialValue.startsWith('@') ? socialValue : `@${socialValue}`;
            }

            formData.append(`socialLinks[${platform}]`, socialValue);

            if (!user.id) throw new Error("User ID is missing");
            const response = await updateUserService(user.id as string, formData);
            toast.success(`${platform} link added successfully`)
            dispatch(updateUserAction(response.data.data));

            // Close dialog
            const backdrop = document.querySelector('[data-state="open"]');
            if (backdrop) (backdrop as HTMLElement).click();
        } catch (error) {

            console.error(`Failed to add ${platform} link:`, error);
            toast.error(`Failed to add ${platform} link:`)
        }
    };

    const handleRemoveSocialLink = async (platform: string) => {
        try {
            const formData = new FormData();
            formData.append(`socialLinks[${platform}]`, '');
            if (!user.id) throw new Error("User ID is missing");
            const response = await updateUserService(user.id as string, formData);
            toast.success(`${platform} link removed successfully`)
            dispatch(updateUserAction(response.data.data));
        } catch (error) {
            console.error(`Failed to remove ${platform} link:`, error);
            toast.error(`Failed to remove ${platform} link:`)
        }
    };

    // Validation schemas


    const renderSocialDialog = (platform: 'linkedin' | 'instagram' | 'x', placeholder: string) => (
        <Dialog>
            <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
                + Add {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md sm:mx-auto p-6">
                <DialogHeader>
                    <DialogTitle>Add {platform.charAt(0).toUpperCase() + platform.slice(1)}</DialogTitle>
                    <DialogDescription>
                        Enter your {platform === 'linkedin' ? 'LinkedIn profile URL' : `${platform} username`}
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{ [platform]: '' }}
                    validationSchema={Yup.object({ [platform]: socialsValidationSchemas[platform] })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await handleAddSocialLink(platform, values[platform]);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="mt-4 flex flex-col gap-4">
                            <Field
                                type="text"
                                name={platform}
                                placeholder={placeholder}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            />
                            <ErrorMessage name={platform} component="div" className="text-red-500 text-sm" />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 bg-accent text-black rounded-lg px-4 py-2 hover:bg-accent/70 transition"
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="flex flex-wrap items-center gap-4">

            {/* LinkedIn */}
            {user.socialLinks?.linkedin ? (
                <div className="group flex items-center gap-1 relative">
                    <FaLinkedin className="text-blue-600" />
                    <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                    >
                        LinkedIn
                    </a>
                    <button
                        onClick={() => handleRemoveSocialLink("linkedin")}
                        className="opacity-0 group-hover:opacity-100 transition absolute -top-1 -right-3 text-gray-400 hover:text-gray-700"
                        title="Remove LinkedIn"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            ) : renderSocialDialog('linkedin', 'https://linkedin.com/in/your-profile')}

            {/* Instagram */}
            {user.socialLinks?.instagram ? (
                <div className="group flex items-center gap-1 relative">
                    <FaInstagram className="text-pink-500" />
                    <a
                        href={`https://instagram.com/${user.socialLinks.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                    >
                        {user.socialLinks.instagram}
                    </a>
                    <button
                        onClick={() => handleRemoveSocialLink("instagram")}
                        className="opacity-0 group-hover:opacity-100 transition absolute -top-1 -right-3 text-gray-400 hover:text-gray-700"
                        title="Remove Instagram"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            ) : renderSocialDialog('instagram', '@username')}

            {/* X / Twitter */}
            {user.socialLinks?.x ? (
                <div className="group flex items-center gap-1 relative">
                    <FaXTwitter className="text-black" />
                    <a
                        href={`https://twitter.com/${user.socialLinks.x.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                    >
                        {user.socialLinks.x}
                    </a>
                    <button
                        onClick={() => handleRemoveSocialLink("x")}
                        className="opacity-0 group-hover:opacity-100 transition absolute -top-1 -right-3 text-gray-400 hover:text-gray-700"
                        title="Remove X"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            ) : renderSocialDialog('x', '@username')}

        </div>
    );
};

export default ProfileSocials;
