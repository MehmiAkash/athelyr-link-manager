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

            {/* Color picker trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Choose theme color"
                className="
                    w-4 h-4
                    rounded-full
                    border border-zinc-500
                    bg-[conic-gradient(from_0deg,red,yellow,lime,cyan,blue,magenta,red)]
                    hover:scale-110
                    active:scale-95
                    transition
                "
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