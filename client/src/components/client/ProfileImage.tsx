import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";

interface User {
    fullName: string;
    profileImage: string;
}

export default function ProfileAvatar({ user }: { user: User }) {
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    const [profileImage, setProfileImage] = useState(user.profileImage);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const DEFAULT_AVATAR = "/default-avatar.png"; // replace with your default image

    const handleChooseFromGallery = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setProfileImage(DEFAULT_AVATAR);
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
        setCapturedImage(null);
    };

    const handleOpenCamera = async () => {
        try {
            // First check if getUserMedia is supported
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('getUserMedia is not supported in this browser');
            }

            // Set camera open state first to ensure the video element is rendered
            setIsCameraOpen(true);

            // Wait a bit for the video element to be available in the DOM
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!videoRef.current) {
                throw new Error('Video element not found');
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);

            try {
                await videoRef.current.play();
                console.log('Camera started successfully');
            } catch (playError) {
                console.error('Error playing video:', playError);
                throw playError;
            }
        } catch (error) {
            console.error('Camera access error:', error);
            alert(error instanceof Error ? error.message : "Camera access denied or not supported");
            setIsCameraOpen(false);
            setStream(null);
        }
    };

    const handleCapturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Flip the image horizontally for selfie-view
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
    };

    const handleAcceptPhoto = () => {
        if (capturedImage) {
            setProfileImage(capturedImage);
            stopCamera();
        }
    };

    return (
        <div className="relative">
            <Avatar className="w-28 h-28">
                <AvatarImage src={profileImage} alt={user.fullName} />
                <AvatarFallback>{user.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                    stopCamera();
                }
            }}>
                <DialogTrigger asChild>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full p-2 bg-black hover:bg-opacity-90"
                        aria-label="Upload photo"
                    >
                        <Camera className="w-5 h-5 text-white" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="w-[90vw] max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                    </DialogHeader>

                    {isCameraOpen ? (
                        <div className="relative flex flex-col items-center gap-4">
                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover mirror"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                                {capturedImage && (
                                    <img
                                        src={capturedImage}
                                        alt="Captured"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex gap-2">
                                {!capturedImage ? (
                                    <Button onClick={handleCapturePhoto}>Capture Photo</Button>
                                ) : (
                                    <>
                                        <Button variant="outline" onClick={() => setCapturedImage(null)}>
                                            Retake
                                        </Button>
                                        <Button onClick={handleAcceptPhoto}>
                                            Use Photo
                                        </Button>
                                    </>
                                )}
                            </div>

                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute top-0 right-0 rounded-full"
                                onClick={stopCamera}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <Button variant="outline" onClick={handleOpenCamera}>
                                Open Camera
                            </Button>
                            <Button variant="outline" onClick={handleChooseFromGallery}>
                                Choose from Gallery
                            </Button>
                            <Button variant="destructive" onClick={handleRemovePhoto}>
                                Remove Current Photo
                            </Button>
                            <Button onClick={() => window.open(user.profileImage, "_blank")}>
                                View Full Photo
                            </Button>

                        </div>
                    )}

                    <DialogFooter />
                </DialogContent>
            </Dialog>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
