import { createContext, useContext, useState, useEffect } from 'react'
import { me, login as apiLogin, logout as apiLogout } from '../api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('souk_token')
    if (token) {
      me()
        .then(r => setUser(r.data))
        .catch(() => {
          localStorage.removeItem('souk_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await apiLogin({ email, password })
    const { token, user } = r.data
    
    localStorage.setItem('souk_token', token)
    setUser(user)
    
    return user
  }

  const logout = async () => {
    try { await apiLogout() } catch {}
    localStorage.removeItem('souk_token')
    setUser(null)
  }

  const register = async (data) => {
    const r = await apiLogin(data) // or apiRegister if defined separately
    // ... logic for register if needed
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
