// ✅ auth.js – handle JWT access/refresh tokens

// 🔹 Get access token from localStorage
export function getToken() {
  return localStorage.getItem("access");
}

// 🔹 Get refresh token from localStorage
export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

// 🔹 Save new tokens
export function saveTokens(access, refresh) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

// 🔹 Refresh access token using refresh token
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    console.error("⚠️ No refresh token found");
    return null;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      console.error("⚠️ Failed to refresh token", await res.text());
      return null;
    }

    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access", data.access);
      console.log("✅ Token refreshed successfully");
      return data.access;
    } else {
      console.error("⚠️ No access token in response", data);
      return null;
    }
  } catch (err) {
    console.error("❌ Error refreshing token:", err);
    return null;
  }
}
