const API_BASE = "http://127.0.0.1:8000/api";

async function apiRequest(endpoint, method = "GET", body = null, needsAuth = false) {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  if (needsAuth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Došlo je do greške");
  }

  return response.json();
}



export const login = (email, password) =>
  apiRequest("/login", "POST", { email, password });

export const register = (name, email, password, password_confirmation = null) =>
  apiRequest("/register", "POST", { name, email, password, password_confirmation});

export const logout = () => apiRequest("/logout", "POST", null, true);

export const changePassword = (current_password, password, password_confirmation) =>
  apiRequest("/change-password", "PATCH", { current_password, password, password_confirmation }, true);

export const getUser = () => apiRequest("/user", "GET", null, true);

export const getEvents = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/events${params ? "?" + params : ""}`, "GET", null, true);
};

export const createEvent = (eventData) =>
  apiRequest("/events", "POST", eventData, true);

export const updateEvent = (id, eventData) =>
  apiRequest(`/events/${id}`, "PUT", eventData, true);

export const deleteEvent = (id) => apiRequest(`/events/${id}`, "DELETE", null, true);

export const joinEvent = (eventId) =>
  apiRequest(`/events/${eventId}/users`, "POST", null, true);

export const updateUserStatus = (eventId, userId, status) =>
  apiRequest(`/events/${eventId}/users/update-status`, "PATCH", { user_id: userId, status }, true);

export const getCategories = () => apiRequest("/categories", "GET", null, true);
