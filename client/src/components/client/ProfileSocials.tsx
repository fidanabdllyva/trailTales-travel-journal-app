import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const ProfileSocials = () => {
    const { data: user, status: userStatus } = useSelector(
        (state: RootState) => state.user
    );

    if (userStatus === "loading") return <LoadingSpinner />;
    if (!user) return <div>No user data found.</div>;

    function handleRemoveSocialLink(platform: string) {
        console.log("Removing social link for:", platform);
    }
    return (
        <>
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
                ) : (
                    <Dialog>
                        <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
                            + Add LinkedIn
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md sm:mx-auto p-6">
                            <DialogHeader>
                                <DialogTitle>Add LinkedIn</DialogTitle>
                                <DialogDescription>
                                    Enter your LinkedIn profile URL
                                </DialogDescription>
                            </DialogHeader>
                            <form className="mt-4 flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/in/your-profile"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 bg-accent text-black rounded-lg px-4 py-2 hover:bg-accent/70 transition"
                                >
                                    Save
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

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
                ) : (
                    <Dialog>
                        <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
                            + Add Instagram
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md sm:mx-auto p-6">
                            <DialogHeader>
                                <DialogTitle>Add Instagram</DialogTitle>
                                <DialogDescription>
                                    Enter your Instagram username
                                </DialogDescription>
                            </DialogHeader>
                            <form className="mt-4 flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="@username"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 bg-accent text-black rounded-lg px-4 py-2 hover:bg-accent/70 transition"
                                >
                                    Save
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

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
                ) : (
                    <Dialog>
                        <DialogTrigger className="border rounded-xl text-sm px-2 py-1 bg-accent text-black hover:cursor-pointer">
                            + Add X
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md sm:mx-auto p-6">
                            <DialogHeader>
                                <DialogTitle>Add X / Twitter</DialogTitle>
                                <DialogDescription>
                                    Enter your X / Twitter username
                                </DialogDescription>
                            </DialogHeader>
                            <form className="mt-4 flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="@username"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                                />
                                <button
                                    type="submit"
                                    className="mt-2 bg-accent text-black rounded-lg px-4 py-2 hover:bg-accent/70 transition"
                                >
                                    Save
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

            </div>
        </>
    )
}

export default ProfileSocials