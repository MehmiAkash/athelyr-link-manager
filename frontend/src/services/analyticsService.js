import API_URL from "../config/api";
import ENDPOINTS from "../config/endpoints";
import { apiFetch } from "./apiFetch";

export async function getAnalytics() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("You are not signed in. Please sign in again.");
    }

    const response = await apiFetch(`${API_URL}${ENDPOINTS.ANALYTICS}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(
            error?.message ||
                `Failed to load analytics (${response.status}): ${response.statusText}`
        );
    }

    return response.json();
}
