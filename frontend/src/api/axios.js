import axios from 'axios'

// ── Authenticated API (sellers — requires token) ──────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: true,
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
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

export default api
