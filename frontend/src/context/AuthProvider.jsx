import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { showToast } from "../services/toastService";

function readStoredUser() {
    try {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    } catch {
        return null;
    }
}

function getTokenExpiry(token) {
    try {
        const payload = token.split(".")[1];
        const base64Payload = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const decodedPayload = atob(
            base64Payload.padEnd(
                base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
                "="
            )
        );
        const claims = JSON.parse(decodedPayload);
        return Number.isFinite(claims.exp) ? claims.exp * 1000 : null;
    } catch {
        return null;
    }
}

export function AuthProvider({children}) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(readStoredUser);
    const login = useCallback((data)=>{
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
    }, []);
    const updateUser = useCallback((updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, []);
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("links");
        localStorage.removeItem("groups");

        setToken(null);
        setUser(null);
        window.dispatchEvent(new Event("app:logout"));
    }, []);

    useEffect(() => {
        let expirationNoticeShown = false;

        const invalidateSession = () => {
            const hadStoredSession = Boolean(
                localStorage.getItem("token") ||
                localStorage.getItem("user")
            );
            logout();

            if (hadStoredSession && !expirationNoticeShown) {
                expirationNoticeShown = true;
                showToast(
                    "warning",
                    "Your session expired. Please sign in again."
                );
            }
        };

        const verifyStoredSession = () => {
            if (
                !localStorage.getItem("token") ||
                !localStorage.getItem("user")
            ) {
                invalidateSession();
            }
        };

        const handleStorageChange = (event) => {
            if (
                event.key === null ||
                event.key === "token" ||
                event.key === "user"
            ) {
                verifyStoredSession();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                verifyStoredSession();
            }
        };

        window.addEventListener("app:auth-expired", invalidateSession);
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("focus", verifyStoredSession);
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        verifyStoredSession();

        return () => {
            window.removeEventListener("app:auth-expired", invalidateSession);
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("focus", verifyStoredSession);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [logout]);

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        const expiry = getTokenExpiry(token);
        if (expiry === null) {
            return undefined;
        }

        const timeout = window.setTimeout(
            () => window.dispatchEvent(new Event("app:auth-expired")),
            Math.max(0, expiry - Date.now())
        );

        return () => window.clearTimeout(timeout);
    }, [token]);

    return (
    <AuthContext.Provider 
        value={{ 
            token,
            user,
            login,
            updateUser,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
  );
}