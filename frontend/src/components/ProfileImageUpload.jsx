import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

import ProfileAvatar from "./ProfileAvatar";
import { uploadProfileImage } from "../services/profileService";
import { showToast } from "../services/toastService";

function ProfileImageUpload({ user, onUploaded }) {
    const fileInput = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) {
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            showToast("error", "Choose a PNG, JPEG, or GIF image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast("error", "Profile images must be 5 MB or smaller.");
            return;
        }

        setUploading(true);
        try {
            const updatedProfile = await uploadProfileImage(file);
            onUploaded(updatedProfile);
            showToast("success", "Profile image updated");
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <ProfileAvatar user={user} className="h-28 w-28 sm:h-32 sm:w-32" />
            <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-50"
            >
                <FaCamera />
                {uploading ? "Uploading..." : "Change photo"}
            </button>
            <p className="text-center text-xs text-zinc-500">
                PNG, JPEG, or GIF · up to 5 MB
            </p>
        </div>
    );
}

export default ProfileImageUpload;
