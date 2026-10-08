import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../services/toastService";

import PopupCard from "./PopupCard";

function LogoutPopup({ onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
        showToast(
            "success",
            "Logged out successfully"
        );
    };

    return (
        <PopupCard onClose={onClose}>
            <h2
                className="
                    text-white
                    text-xl
                    text-center
                "
            >
                Are you sure?
            </h2>

            <p
                className="
                    text-gray-400
                    text-sm
                    text-center
                    mt-2
                "
            >
                Do you want to log out?
            </p>

            <div
                className="
                    flex
                    justify-center
                    gap-4
                    mt-5
                "
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="
                        px-5
                        py-2

                        rounded-lg

                        text-white

                        hover:bg-zinc-800

                        transition
                    "
                >
                    No
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        px-5
                        py-2

                        rounded-lg

                        text-(--accent-300)

                        hover:bg-zinc-800

                        transition
                    "
                >
                    Yes
                </button>
            </div>
        </PopupCard>
    );
}

export default LogoutPopup;