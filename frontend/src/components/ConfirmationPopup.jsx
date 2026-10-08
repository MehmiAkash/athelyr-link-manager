import PopupCard from "./PopupCard";

function ConfirmationPopup({
    loading,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "Do you want to delete this link?",
}) {
    return (
        <PopupCard
            loading={loading}
            onClose={onClose}
        >
            <h2
                className="
                    text-white
                    text-xl
                    text-center
                "
            >
                {title}
            </h2>

            <p
                className="
                    text-gray-400
                    text-sm
                    text-center
                    mt-2
                "
            >
                {message}
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
                    disabled={loading}
                    className="
                        px-5
                        py-2
                        rounded-lg
                        text-white
                        hover:bg-zinc-800
                        transition
                        disabled:opacity-50
                    "
                >
                    No
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="
                        px-5
                        py-2
                        rounded-lg
                        text-(--accent-300)
                        hover:bg-zinc-800
                        transition
                        disabled:opacity-50
                    "
                >
                    Yes
                </button>
            </div>
        </PopupCard>
    );
}

export default ConfirmationPopup;