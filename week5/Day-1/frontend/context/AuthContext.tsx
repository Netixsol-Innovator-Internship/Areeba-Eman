"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  token: string | null
  username: string | null
  login: (token: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUsername = localStorage.getItem("username")
    if (storedToken) {
      setToken(storedToken)
      setUsername(storedUsername)
    }
    setLoading(false)
  }, [])

 const login = (newToken: string, newUsername: string) => {
  localStorage.setItem("token", newToken)
  localStorage.setItem("username", newUsername)
  setToken(newToken)
  setUsername(newUsername)
  router.push("/") // <- main page
}

  const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  setToken(null)
  setUsername(null)
  router.push("/login")
}

  // While checking localStorage, don't render children
  if (loading) return null

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
