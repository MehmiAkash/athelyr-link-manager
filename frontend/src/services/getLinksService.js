import API_URL from "../config/api";
import ENDPOINTS from "../config/endpoints";
import { linkTypeMap } from "../config/helper";
import { apiFetch } from "./apiFetch";



export async function getAllLinks(linkType) {
    const token = localStorage.getItem("token");
    
    const endpoint = linkTypeMap(linkType); 
    if(!endpoint){
        throw new Error(`Invalid link type: ${linkType}`);
    }
    const response = await apiFetch(
        `${API_URL}${endpoint}`,
        {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        }
    );
    if(!response.ok){
        throw new Error(`Failed to fetch link: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export async function getLinksPage(
    linkType,
    offset = 0,
    size = 20,
    favoritesOnly = false,
    search = ""
) {
    const endpoint = linkTypeMap(linkType);
    if (!endpoint) {
        throw new Error(`Invalid link type: ${linkType}`);
    }

    const params = new URLSearchParams({
        offset: String(offset),
        size: String(size),
    });
    if (favoritesOnly) {
        params.set("favourite", "true");
    }
    if (search.trim()) {
        params.set("search", search.trim());
    }

    const response = await apiFetch(`${API_URL}${endpoint}/page?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch links: ${response.statusText}`);
    }

    return response.json();
}

export async function deleteLink(linkType , id) {
    const token = localStorage.getItem("token");
    
    const endpoint = linkTypeMap(linkType); 
    if(!endpoint){
        throw new Error(`Invalid link type: ${linkType}`);
    }
    const response = await apiFetch(
        `${API_URL}${endpoint}/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        }
    );
    if(!response.ok){
        const responseBody = await response.text();
        let errorMessage;
        try {
            errorMessage = JSON.parse(responseBody).message;
        } catch {
            errorMessage = "";
        }
        throw new Error(
            errorMessage || `Failed to delete link: ${response.statusText}`
        );
    }
}
export async function incrementCopyCountPrivateLink(id) {
    const token = localStorage.getItem("token");
    const response = await apiFetch(
        `${API_URL}${ENDPOINTS.PRIVATELINK}/${id}/${ENDPOINTS.COPY}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        }
    );
    if(!response.ok){
        throw new Error(`Failed to increment: ${response.statusText}`);
    }
}
