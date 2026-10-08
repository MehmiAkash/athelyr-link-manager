import { useEffect } from "react";

import Loader from "./Loader";

function PopupCard({
    children,
    loading = false,
    onClose,
    maxWidth = "max-w-sm",
    panelClassName = "",
}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose, loading]);

    return (
        <div
            className="
                fixed
                inset-0
                z-100

                flex
                items-center
                justify-center

                bg-black/60
                backdrop-blur-sm

                px-4
            "
            onClick={!loading ? onClose : undefined}
        >
            <div
                className={`
                    relative

                    bg-zinc-700/10
                    backdrop-blur-sm

                    py-5
                    px-8

                    rounded-xl

                    border
                    border-zinc-700/50

                    shadow-2xl

                    w-full
                    ${maxWidth}
                    ${panelClassName}
                `}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {loading && <Loader />}

                {children}
            </div>
        </div>
    );
}

export default PopupCard;