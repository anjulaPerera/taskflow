const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Store and retrieve the JWT token from localStorage
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("taskflow_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("taskflow_token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("taskflow_token");
};

// Base fetch function that adds auth headers automatically
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

// Auth functions
export const registerUser = (email: string, password: string, name: string) =>
  apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

export const loginUser = (email: string, password: string) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Project functions
export const getProjects = () => apiFetch("/api/projects");

export const createProject = (name: string, description: string) =>
  apiFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

export const deleteProject = (id: string) =>
  apiFetch(`/api/projects/${id}`, { method: "DELETE" });

// Task functions
export const getTasks = (projectId: string) =>
  apiFetch(`/api/projects/${projectId}/tasks`);

export const createTask = (
  projectId: string,
  title: string,
  description: string,
) =>
  apiFetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });

export const updateTaskStatus = (
  projectId: string,
  taskId: string,
  status: string,
) =>
  apiFetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteTask = (projectId: string, taskId: string) =>
  apiFetch(`/api/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
