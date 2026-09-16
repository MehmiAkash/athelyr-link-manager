import { useState } from "react";
import LogoutPopup from "./LogoutPopup";

function Profile({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="
                    w-10 h-10
                    rounded-full
                    overflow-hidden
                    border border-zinc-700
                    hover:border-zinc-500
                    active:scale-95
                    transition
                    bg-zinc-800
                "
            >
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                )}
            </button>

            {open && (
                <LogoutPopup onClose={() => setOpen(false)} />
            )}
        </>
    );
} 

export default Profile;