const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SUBMIT_API = `${API_BASE}/submit`;

export async function submitSolution({ code, language, problemId }) {
  try {
    const response = await fetch(SUBMIT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, language, problemId }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "Error",
        error: data?.message || `HTTP error! status: ${response.status}`,
      };
    }

    return data || { status: "Error", error: "Empty response from server" };
  } catch (error) {
    return {
      status: "Error",
      error: `Failed to submit code: ${error.message}`,
    };
  }
}
