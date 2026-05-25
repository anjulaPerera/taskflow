export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  project_id: string
  user_id: string
  created_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  error: string
}