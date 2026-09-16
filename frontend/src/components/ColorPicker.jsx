import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/useTheme";
import { colors } from "../config/colors";

function ColorPicker() {
    const [open, setOpen] = useState(false);
    const { accentColor, setAccentColor } = useTheme();

    const pickerRef = useRef(null);

    const colorNames = Object.keys(colors);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleColorSelect = (color) => {
        setAccentColor(color);
        setOpen(false);
    };

    return (
        <div ref={pickerRef} className="relative inline-block">

            {/* Current color */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="
                    w-3 h-3
                    rounded-full
                    border border-zinc-600
                    hover:scale-110
                    transition
                "
                style={{
                    backgroundColor: colors[accentColor][500],
                }}
            />

            {/* Color popup */}
            {open && (
                <div
                    className="
                        absolute
                        top-full
                        right-0
                        mt-2
                        z-50
                        bg-zinc-900
                        border border-zinc-700
                        rounded-xl
                        p-2
                        shadow-xl
                    "
                >
                    <div className="flex flex-col items-center gap-2">
                        {colorNames.map((color) => (
                            <button
                                key={color}
                                type="button"
                                title={color}
                                onClick={() => handleColorSelect(color)}
                                className={`
                                    w-3 h-3
                                    rounded-full
                                    hover:scale-110
                                    active:scale-95
                                    transition
                                    ${
                                        accentColor === color
                                            ? "ring-2 ring-white ring-offset-1 ring-offset-zinc-900"
                                            : ""
                                    }
                                `}
                                style={{
                                    backgroundColor: colors[color][500],
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ColorPicker;