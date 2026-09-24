const API_BASE_URL = "http://127.0.0.1:8000";

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("SmartTag API is unavailable");
  }

  return response.json() as Promise<{
    status: string;
    service: string;
  }>;
}