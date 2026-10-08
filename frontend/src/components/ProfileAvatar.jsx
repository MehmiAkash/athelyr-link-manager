import { useState } from "react";
import { getProfileImageSource } from "../services/profileService";

function ProfileAvatar({ user, className = "h-24 w-24" }) {
    const imageSource = getProfileImageSource(user?.profileImageUrl);
    const [failedImageSource, setFailedImageSource] = useState("");

    return (
        <div
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-3xl font-semibold text-zinc-300 ${className}`}
        >
            {imageSource && failedImageSource !== imageSource ? (
                <img
                    src={imageSource}
                    alt={`${user.name || "User"} profile`}
                    className="h-full w-full object-cover"
                    onError={() => setFailedImageSource(imageSource)}
                />
            ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
        </div>
    );
}

export default ProfileAvatar;
