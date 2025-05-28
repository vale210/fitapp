import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    nombre: string
    email: string
    rol: string
  }
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, data)
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/register`, data)
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

export const logout = (): void => {
  localStorage.removeItem('user')
}

export const getCurrentUser = (): AuthResponse | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
} 