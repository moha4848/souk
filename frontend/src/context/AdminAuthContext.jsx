import { createContext, useState, useEffect, useContext } from 'react'
import { login as apiLogin, logout as apiLogout, me as apiMe } from '../api/services'

const AdminAuthContext = createContext()

export const useAdminAuth = () => useContext(AdminAuthContext)

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('souk_admin_token')
    if (token) {
      // Use the generic 'me' call but verify it's an admin
      apiMe()
        .then(r => {
          const user = r.data
          const isStaff = user.role === 'superadmin' || user.role === 'staff' || user.is_super_admin
          if (isStaff) {
            setAdmin(user)
          } else {
            throw new Error('Not authorized')
          }
        })
        .catch(() => {
          localStorage.removeItem('souk_admin_token')
          setAdmin(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginAdmin = async (email, password) => {
    // Call the dedicated admin login endpoint
    const r = await apiLogin({ email, password, isAdminLogin: true })
    const { token, user } = r.data
    
    // Any staff in team_members is allowed, their role determines access in UI
    localStorage.setItem('souk_admin_token', token)
    setAdmin(user)
    return user
  }

  const logoutAdmin = async () => {
    try { await apiLogout() } catch {}
    localStorage.removeItem('souk_admin_token')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
