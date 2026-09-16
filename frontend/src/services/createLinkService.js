import API_URL from "../config/api";
import ENDPOINTS from "../config/endpoints";


export async function createLink(linkData , linkType) {
  
    const token = localStorage.getItem("token");
    const endpointMap = {
        short: ENDPOINTS.SHORTLINK,
        private: ENDPOINTS.PRIVATELINK,
    }
    const endpoint = endpointMap[linkType];
    if(!endpoint){
        throw new Error(`Invalid link type: ${linkType}`);
        
    }
    const response = await fetch(
            `${API_URL}${ENDPOINTS.linkType}`,
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