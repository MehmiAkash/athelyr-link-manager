import API_URL from "../config/api";
import { linkTypeMap } from "../config/helper";
import { apiFetch } from "./apiFetch";

export async function createLink(linkData , linkType) {
  
    const token = localStorage.getItem("token");
    
    const endpoint = linkTypeMap(linkType);
    if(!endpoint){
        throw new Error(`Invalid link type: ${linkType}`);
        
    }
    const response = await apiFetch(
            `${API_URL}${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify(linkData),
            }
        );
        if(!response.ok){
            throw new Error(`Failed to create link: ${response.statusText}`);
            
        }
    const data = await response.json();
    return data;
}

export async function updateLink(linkData , id , linkType) {
    const token = localStorage.getItem("token");
    
    const endpoint = linkTypeMap(linkType);
    if(!endpoint){
        throw new Error(`Invalid link type: ${linkType}`);
        
    }
    const response = await apiFetch(
            `${API_URL}${endpoint}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify(linkData),
            }
        );
        if(!response.ok){
            throw new Error(`Failed to create link: ${response.statusText}`);
            
        }
    const data = await response.json();
    return data;
}