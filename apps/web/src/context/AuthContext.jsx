import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@utils/api'

const AuthContext = createContext(null)

const MOCK_USER = {
  name: 'Alex M.',
  email: 'alex@startup.io',
  plan: 'starter',
  avatar: null,
}

const isMockCredentials = (email) =>
  import.meta.env.DEV && email === MOCK_USER.email

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('humora_auth_token')
    if (token === '__mock__') {
      setUser(MOCK_USER)
      setLoading(false)
      return
    }
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('humora_auth_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    if (isMockCredentials(email)) {
      localStorage.setItem('humora_auth_token', '__mock__')
      setUser(MOCK_USER)
      return MOCK_USER
    }
    const { user: u, token } = await api.auth.login(email, password)
    localStorage.setItem('humora_auth_token', token)
    setUser(u)
    return u
  }

  const signup = async (name, email, password) => {
    if (isMockCredentials(email)) {
      const mockNew = { ...MOCK_USER, name }
      localStorage.setItem('humora_auth_token', '__mock__')
      setUser(mockNew)
      return mockNew
    }
    const { user: u, token } = await api.auth.signup(name, email, password)
    localStorage.setItem('humora_auth_token', token)
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('humora_auth_token')
    setUser(null)
  }

  const setUserFromToken = (u) => setUser(u)

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      setUserFromToken,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
