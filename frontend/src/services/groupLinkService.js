import API_URL from "../config/api";
import ENDPOINTS from "../config/endpoints";
import { apiFetch } from "./apiFetch";

const authorizationHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const readResponse = async (response, message) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `${message}: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    const responseBody = await response.text();
    if (!responseBody) {
        return null;
    }

    try {
        return JSON.parse(responseBody);
    } catch {
        throw new Error(`${message}: invalid response from server`);
    }
};

export async function getGroups() {
    const response = await apiFetch(`${API_URL}${ENDPOINTS.GROUPS}`, {
        headers: authorizationHeaders(),
    });

    return readResponse(response, "Failed to load groups");
}

export async function getGroup(groupId) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}`,
        {
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to load group");
}

export async function leaveGroup(groupId) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}/leave`,
        {
            method: "DELETE",
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to leave group");
}

export async function deleteGroup(groupId) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}`,
        {
            method: "DELETE",
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to delete group");
}

export async function searchGroups(query) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/search?query=${encodeURIComponent(query)}`,
        {
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to search groups");
}

export async function getGroupMembers(groupId) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}/members`,
        {
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to load group members");
}

export async function removeGroupMember(groupId, email) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}/members`,
        {
            method: "DELETE",
            headers: authorizationHeaders(),
            body: JSON.stringify({ email }),
        }
    );

    return readResponse(response, "Failed to remove group member");
}

export async function updateGroupMemberRole(groupId, email, role) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUPS}/${groupId}/members/role`,
        {
            method: "PATCH",
            headers: authorizationHeaders(),
            body: JSON.stringify({ email, role }),
        }
    );

    return readResponse(response, "Failed to update group member role");
}

export async function getGroupSharedLinks(
    groupId,
    linkType,
    query = "",
    page = 0,
    size = 10
) {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUP_LINKS}/search?${params}`,
        {
        method: "POST",
        headers: authorizationHeaders(),
        body: JSON.stringify({
            groupId,
            linkType: linkType.toUpperCase(),
            query,
        }),
        }
    );

    return readResponse(response, "Failed to load shared links");
}

export async function shareLinkWithGroup(groupId, linkType, linkId) {
    const response = await apiFetch(`${API_URL}${ENDPOINTS.GROUP_LINKS}`, {
        method: "POST",
        headers: authorizationHeaders(),
        body: JSON.stringify({
            groupId,
            linkId,
            linkType: linkType.toUpperCase(),
        }),
    });

    return readResponse(response, "Failed to share link");
}

export async function deleteGroupSharedLink(groupId, linkType, groupLinkId) {
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.GROUP_LINKS}/${groupId}/${linkType.toUpperCase()}/${groupLinkId}`,
        {
            method: "DELETE",
            headers: authorizationHeaders(),
        }
    );

    return readResponse(response, "Failed to delete shared link");
}
