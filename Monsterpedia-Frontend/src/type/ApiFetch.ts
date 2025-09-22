const API = "http://localhost:8080";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"| "HEAD";

async function apiFetch<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: any,
  customToken?: string
): Promise<T> {
  const token = customToken ?? localStorage.getItem("token");

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET" && method !== "HEAD") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API}/${endpoint}`, options);

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Errore Api: ${response.status}, ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as unknown as T;
  } 
  
  return text ? JSON.parse(text) : null as unknown as T;
}

export default apiFetch;