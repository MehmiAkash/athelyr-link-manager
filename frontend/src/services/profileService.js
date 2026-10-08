import API_URL from "../config/api";
import { apiFetch } from "./apiFetch";

const profileEndpoint = `${API_URL}/profile`;

function authorizationHeaders() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("You are not signed in. Please sign in again.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

async function readResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.message || fallbackMessage);
    }
    return data;
}

export async function getProfile() {
    const response = await apiFetch(profileEndpoint, {
        headers: authorizationHeaders(),
    });
    return readResponse(response, "Failed to load profile");
}

export async function updateProfile(profile) {
    const response = await apiFetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: {
            ...authorizationHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
    });
    return readResponse(response, "Failed to update profile");
}

export async function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch(`${profileEndpoint}/image`, {
        method: "POST",
        headers: authorizationHeaders(),
        body: formData,
    });
    return readResponse(response, "Failed to upload profile image");
}

export function getProfileImageSource(imageUrl) {
    if (!imageUrl) {
        return "";
    }
    return imageUrl.startsWith("http")
        ? imageUrl
        : `${API_URL}${imageUrl}`;
}
