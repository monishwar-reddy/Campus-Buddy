import { createContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        })
      }
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginWithProvider = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Login Error:', error.message)
      alert(`Login failed: ${error.message}`)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateProfile = async (data) => {
    const { data: updatedUser, error } = await supabase.auth.updateUser({
      data: {
        full_name: data.username || user.username,
        avatar_url: data.avatar || user.avatar
      }
    })

    if (error) return { error }

    setUser(prev => ({
      ...prev,
      username: updatedUser.user.user_metadata.full_name,
      avatar: updatedUser.user.user_metadata.avatar_url
    }))
    return { data: updatedUser }
  }

  const uploadAvatar = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file)

    if (uploadError) return { error: uploadError }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    return updateProfile({ avatar: publicUrl })
  }

  return (
    <UserContext.Provider value={{ user, loading, loginWithProvider, logout, updateProfile, uploadAvatar }}>
      {!loading && children}
    </UserContext.Provider>
  )
}
