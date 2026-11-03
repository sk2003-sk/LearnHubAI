import { useState } from "react";
import { toast } from "sonner";
import { updateUserProfilePicture } from "../api/profile.api";
import { prepareImageForUpload } from "../../../utils/fileUpload";
import { useAuth } from "../../auth/hooks/useAuth";
import { Camera } from "lucide-react";

const MAX_SOURCE_MB = 20;

function ProfileAvatar() {
  const { user, refetchUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > MAX_SOURCE_MB * 1024 * 1024) {
      toast.error(`Image size must be less than ${MAX_SOURCE_MB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const avatar = await prepareImageForUpload(file);

      await updateUserProfilePicture({ avatar });
      await refetchUser();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="size-32 overflow-hidden rounded-full border-4 border-white bg-surface-secondary shadow-lg dark:border-border ">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name || "Profile"}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface-secondary ">
            <span className="text-3xl font-semibold text-foreground dark:text-accent">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        )}
      </div>

      <label
        htmlFor="avatar-upload"
        className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-background/65 transition-opacity ${
          isUploading ? "opacity-100 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {isUploading ? (
          <span className="text-sm text-white">Uploading...</span>
        ) : (
          <div className="flex flex-col items-center text-white">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">Change</span>
          </div>
        )}
      </label>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}

export default ProfileAvatar;
