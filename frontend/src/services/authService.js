import API_URL from "../config/api";
import ENDPOINT from "../config/endpoints"

export async function loginUser(loginData) {
    const response = await fetch(
        `${API_URL}${ENDPOINT.LOGIN}`,
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(loginData),
        }
    );
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.message || "login failed");
        
    }
    return data;
}

export async function registerUser(registerData) {
    const response = await fetch(
        `${API_URL}${ENDPOINT.REGISTER}`,
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(registerData),
        }
    );
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.message||"Registration failed");
        
    }
    return data;
}