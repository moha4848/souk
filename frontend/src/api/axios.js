import axios from 'axios'

// En dev : Vite proxy redirige /api → localhost:8000
// En prod : VITE_API_URL = https://your-backend.railway.app/api
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ── Authenticated API (sellers — requires token) ──────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: false, // false in production (JWT, not cookies)
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('souk_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('souk_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Public API (clients — no auth) ───────────────────────────────────
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default api
