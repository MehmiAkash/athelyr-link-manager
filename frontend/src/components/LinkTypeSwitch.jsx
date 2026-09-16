function LinkTypeSwitch({ selected, onChange }) {
    return (
        <div className="flex justify-center mt-2">
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-full p-1">

                <button
                    type="button"
                    onClick={() => onChange("short")}
                    className={`
                        px-4 py-1.5
                        rounded-full
                        text-sm
                        transition-all
                        ${
                            selected === "short"
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-500 hover:text-zinc-300"
                        }
                    `}
                >
                    Short Link
                </button>

                <button
                    type="button"
                    onClick={() => onChange("private")}
                    className={`
                        px-4 py-1.5
                        rounded-full
                        text-sm
                        transition-all
                        ${
                            selected === "private"
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-500 hover:text-zinc-300"
                        }
                    `}
                >
                    Private Link
                </button>

            </div>
        </div>
    );
}

export default LinkTypeSwitch;