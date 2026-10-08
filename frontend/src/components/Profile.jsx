import { Link } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

function Profile({ user }) {
    return (
        <Link
            to="/profile"
            aria-label="Open profile"
            title="Profile"
            className="rounded-full transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-(--accent-400)"
        >
            <ProfileAvatar user={user} className="h-10 w-10 border-zinc-700 text-xs" />
        </Link>
    );
}

export default Profile;