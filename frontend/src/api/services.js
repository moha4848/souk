import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Add token interceptor to attach JWT to every request
api.interceptors.request.use(config => {
  // If the request is to an admin endpoint or we are on an admin page, prioritize the admin token
  const isAdminRequest = config.url.startsWith('/admin') || config.url.startsWith('admin/') || window.location.pathname.startsWith('/admin')
  const token = isAdminRequest 
    ? (localStorage.getItem('souk_admin_token') || localStorage.getItem('souk_token'))
    : (localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token'))

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Authentication (Real API) ──────────────────────────────────────────
export const login = (data) => {
  const endpoint = data.isAdminLogin ? '/admin/login' : '/login'
  return api.post(endpoint, data)
}
export const register = (data) => api.post('/register', data)
export const me = () => api.get('/me')
export const logout = () => api.post('/logout')
export const uploadFile = (formData) => api.post('/upload', formData, { 
  headers: { 'Content-Type': 'multipart/form-data' } 
})

// ── Onboarding & Packages ──────────────────────────────────────────
export const getPackages = () => api.get('/packages')
export const updateProjectType = (type) => api.post('/onboarding/project-type', { project_type: type })
export const subscribeToPackage = (packageId) => api.post('/onboarding/subscribe', { package_id: packageId })

// ── SuperAdmin ──────────────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats')
export const getPendingUsers = () => api.get('/admin/pending-users')
export const approveUser = (id) => api.post(`/admin/users/${id}/approve`)
export const rejectUser = (id) => api.post(`/admin/users/${id}/reject`)

export const getPendingSubscriptions = () => api.get('/admin/pending-subscriptions')
export const approveSubscription = (id) => api.post(`/admin/subscriptions/${id}/approve`)
export const rejectSubscription = (id) => api.post(`/admin/subscriptions/${id}/reject`)

export const getCommissions = () => api.get('/admin/finance/commissions')

// ── Real API Services ──────────────────────────────────────────────

// ── Dashboard ───────────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard')
export const getSellerDashboard = () => api.get('/seller/analytics')
export const updateStoreTheme = (settings) => api.put('/seller/settings/theme', { theme_settings: settings })

// ── AI Generator ────────────────────────────────────────────────────
export const generateAIProduct = (name) => api.post('/seller/ai-generator/product', { name })
export const generateAIStore = (prompt) => api.post('/seller/ai-generator/store', { prompt })

// ── Products Management ─────────────────────────────────────────────
export const getProducts = (params) => api.get('/products', { params })
export const getProduct = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// ── Marketplace & Social (Real API) ──────────────────────────────────
export const exploreMarketplace = () => api.get('/marketplace/explore')
export const searchMarketplace = (params) => api.get('/marketplace/search', { params })
export const followStore = (id) => api.post(`/social/${id}/follow`)
export const likeProduct = (id) => api.post(`/social/product/${id}/like`)

// ── Orders Management ───────────────────────────────────────────────
export const getOrders = (params) => api.get('/orders/vendor', { params })
export const getOrder = (id) => api.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, { status })

// ── Public Storefront API (Real API) ──────────────────────────────────
export const getStoreProducts = (slug) => api.get(`/store/${slug}`)
export const getStoreProduct = (slug, id) => api.get(`/store/${slug}/products/${id}`)

export const placeOrder = (data) => api.post('/orders', data)
export const getVendorOrders = () => api.get('/orders/vendor')
export const getClientOrders = () => api.get('/orders/client')

// Compatibility export
export const publicApi = {
  get: (url, config) => {
    if (url.includes('/products')) return getProducts(config?.params)
    return api.get(url, config)
  }
}

