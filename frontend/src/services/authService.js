const API_URL = "http://localhost:3000/api/auth";

// Register new user
export async function register(email, password, displayName) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Registration failed");
  }

  const data = await res.json();
  
  // Save token to localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  
  return data;
}

// Login user
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();
  
  // Save token to localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  
  return data;
}

// Logout user
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Get current user info
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return null;
  }

  const res = await fetch(`${API_URL}/me`, {
    headers: { 
      "Authorization": `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    // Token invalid or expired
    logout();
    return null;
  }

  return await res.json();
}

// Check if user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Get stored user from localStorage
export function getStoredUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Get token
export function getToken() {
  return localStorage.getItem("token");
}
