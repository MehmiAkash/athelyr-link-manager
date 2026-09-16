import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../services/toastService";

function LogoutPopup({ onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleLogout = () => {
        logout();
        navigate("/login");
        showToast("success","logged out sucessfully");
    };

    return (
        <div
            className="
                fixed inset-0
                z-100
                flex items-center justify-center
                bg-black/60
                backdrop-blur-sm
                px-4
            "
            onClick={onClose}
        >
            <div
                className="
                    bg-zinc-700/10
                    backdrop-blur-sm
                    py-5
                    px-8
                    rounded-xl
                    border border-zinc-700/50
                    shadow-2xl
                    w-full
                    max-w-sm
                "
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-white text-xl text-center">
                    Are you sure?
                </h2>

                <p className="text-gray-400 text-sm text-center mt-2">
                    Do you want to log out?
                </p>

                <div className="flex justify-center gap-4 mt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            px-5 py-2
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
                            px-5 py-2
                            rounded-lg
                            text-(--accent-300)
                            hover:bg-zinc-800
                            transition
                        "
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutPopup;