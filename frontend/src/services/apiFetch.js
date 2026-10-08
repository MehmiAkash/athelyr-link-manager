export async function apiFetch(input, init) {
    const response = await fetch(input, init);

    if (response.status === 401) {
        window.dispatchEvent(new Event("app:auth-expired"));
    }

    return response;
}
