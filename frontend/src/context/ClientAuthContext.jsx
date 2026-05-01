import { createContext, useState, useEffect, useContext } from 'react'
// Using public API for clients later

const ClientAuthContext = createContext()

export const useClientAuth = () => useContext(ClientAuthContext)

import { login as apiLogin, register as apiRegister, me as apiMe } from '../api/services'

export const ClientAuthProvider = ({ children }) => {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('souk_token')
    if (token) {
      apiMe()
        .then(r => setClient(r.data))
        .catch(() => setClient(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginClient = async (email, password) => {
    const r = await apiLogin({ email, password })
    localStorage.setItem('souk_token', r.data.token)
    setClient(r.data.user)
    return r.data.user
  }

  const registerClient = async (data) => {
    const r = await apiRegister({ ...data, role: 'client' })
    localStorage.setItem('souk_token', r.data.token)
    setClient(r.data.user)
    return r.data.user
  }

  const refreshClient = async () => {
    try {
      const r = await apiMe()
      setClient(r.data)
    } catch (e) {
      console.error("Refresh failed")
    }
  }

  const logoutClient = () => {
    localStorage.removeItem('souk_token')
    setClient(null)
  }


  return (
    <ClientAuthContext.Provider value={{ client, loading, loginClient, registerClient, logoutClient, refreshClient }}>
      {children}
    </ClientAuthContext.Provider>
  )
}
