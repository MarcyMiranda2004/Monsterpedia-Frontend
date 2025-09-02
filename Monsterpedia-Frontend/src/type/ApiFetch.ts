const API = "http://localhost:8080"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

async function apiFetch<T>(endpoint: string, method: HttpMethod = "GET", body?: any): Promise<T> {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const response = await fetch(`${API}/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Errore Api: ${response.status}, ${response.statusText}`);
    }

    return response.json();
}

export default apiFetch;