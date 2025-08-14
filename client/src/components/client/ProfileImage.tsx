import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { updateUser as updateUserAction } from "@/redux/features/userSlice";
import { updateUser as updateUserService } from "@/api/requests/userService";
import type { RootState } from "@/redux/store";
import { DEFAULT_AVATAR_PHOTO } from "@/api/constants";
import { toast } from "sonner"; 

export default function ProfileAvatar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const userId = useSelector((state: RootState) => state.auth.id);
 
  if (!user || !userId) return null;
  const [profileImage, setProfileImage] = useState(user?.profileImage || DEFAULT_AVATAR_PHOTO);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleChooseFromGallery = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadPhoto(file);
  };

  const handleRemovePhoto = async () => {
    await uploadPhoto(null, true);
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const handleOpenCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera not supported");
      setIsCameraOpen(true);
      await new Promise(r => setTimeout(r, 100));
      if (!videoRef.current) throw new Error("Video element not found");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      await videoRef.current.play();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to access camera"); 
      setIsCameraOpen(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // mirror selfie
    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  const handleAcceptPhoto = async () => {
    if (!capturedImage) return;
    const blob = await (await fetch(capturedImage)).blob();
    const file = new File([blob], "captured.png", { type: "image/png" });
    await uploadPhoto(file);
    stopCamera();
  };

  const uploadPhoto = async (file: File | null, isDefault = false) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (isDefault) {
        formData.append("resetToDefault", "true");
      } else if (file) {
        formData.append("profileImage", file);
      }

      const res = await updateUserService(userId, formData);
      setProfileImage(res.data.data.profileImage);
      dispatch(updateUserAction(res.data.data));
      toast.success("Profile photo updated successfully"); 
    } catch (err: any) {
      console.error("Upload error:", err.message);
      toast.error(err.message || "Failed to update profile image"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="w-28 h-28">
        <AvatarImage src={profileImage} alt={user?.fullName || "User"} />
        <AvatarFallback>{user?.fullName?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
      </Avatar>

      <Dialog open={isDialogOpen} onOpenChange={open => { setIsDialogOpen(open); if (!open) stopCamera(); }}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full p-2 bg-black hover:bg-opacity-90"
            disabled={loading}
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
                  <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>

              <div className="flex gap-2">
                {!capturedImage ? (
                  <Button onClick={handleCapturePhoto} disabled={loading}>
                    {loading ? "Processing..." : "Capture Photo"}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setCapturedImage(null)} disabled={loading}>
                      Retake
                    </Button>
                    <Button onClick={handleAcceptPhoto} disabled={loading}>
                      {loading ? "Uploading..." : "Use Photo"}
                    </Button>
                  </>
                )}
              </div>

              <Button size="icon" variant="outline" className="absolute top-0 right-0 rounded-full" onClick={stopCamera} disabled={loading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="outline" onClick={handleOpenCamera} disabled={loading}>
                {loading ? "Loading..." : "Open Camera"}
              </Button>
              <Button variant="outline" onClick={handleChooseFromGallery} disabled={loading}>
                {loading ? "Loading..." : "Choose from Gallery"}
              </Button>
              <Button variant="destructive" onClick={handleRemovePhoto} disabled={loading}>
                {loading ? "Removing..." : "Remove Current Photo"}
              </Button>
              {user?.profileImage && (
                <Button onClick={() => window.open(user.profileImage, "_blank")} disabled={loading}>
                  View Full Photo
                </Button>
              )}
            </div>
          )}

          <DialogFooter />
        </DialogContent>
      </Dialog>

      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} disabled={loading} />
    </div>
  );
}
