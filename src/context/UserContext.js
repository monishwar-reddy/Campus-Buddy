import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('campusconnect_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username, avatar) => {
    const avatarUrl = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    const userData = { username, avatar: avatarUrl }
    setUser(userData)
    localStorage.setItem('campusconnect_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('campusconnect_user')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
