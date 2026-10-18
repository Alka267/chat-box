const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Helper to get token
export const getToken = () => localStorage.getItem("chat_app_token");
export const setToken = (token) => localStorage.setItem("chat_app_token", token);
export const removeToken = () => localStorage.removeItem("chat_app_token");

// Generic fetch wrapper with auth header
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Authentication Services
export const authService = {
  login: async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  signup: async (name, email, password) => {
    const data = await request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  getMe: async () => {
    return await request("/auth/me");
  },

  logout: () => {
    removeToken();
    localStorage.removeItem("chat_app_user");
  },
};

// Users / Contacts Services
export const userService = {
  getUsers: async () => {
    return await request("/users");
  },
};

// Messaging Services
export const messageService = {
  getMessages: async (userToChatId) => {
    return await request(`/messages/${userToChatId}`);
  },

  sendMessage: async (userToChatId, text) => {
    return await request(`/messages/send/${userToChatId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },
};
