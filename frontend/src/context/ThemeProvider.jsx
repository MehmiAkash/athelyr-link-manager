import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";
import { colors } from "../config/colors";

export function ThemeProvider({ children }) {
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem("accentColor") || "rose";
    });

    useEffect(() => {
        const selectedColor = colors[accentColor];

        document.documentElement.style.setProperty(
            "--accent-100",
            selectedColor[100]
        );

        document.documentElement.style.setProperty(
            "--accent-200",
            selectedColor[200]
        );

        document.documentElement.style.setProperty(
            "--accent-300",
            selectedColor[300]
        );

        document.documentElement.style.setProperty(
            "--accent-400",
            selectedColor[400]
        );

        document.documentElement.style.setProperty(
            "--accent-500",
            selectedColor[500]
        );

        document.documentElement.style.setProperty(
            "--accent-600",
            selectedColor[600]
        );

        localStorage.setItem("accentColor", accentColor);
    }, [accentColor]);

    return (
        <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}