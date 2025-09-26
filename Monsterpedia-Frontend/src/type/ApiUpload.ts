const API = "http://localhost:8080";

async function apiUpload<T>(
  endpoint: string,
  file: File,
  customToken?: string
): Promise<T> {
  const token = customToken ?? localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API}/${endpoint}`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Errore Api: ${response.status} - ${msg}`);
  }

  return response.json();
}

export { apiUpload };
