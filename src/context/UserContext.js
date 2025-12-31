import { createContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../firebase'
import { supabase } from '../supabaseClient'
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile as firebaseUpdateProfile } from 'firebase/auth'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for changes on auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          username: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          avatar: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithProvider = async (providerName) => {
    try {
      // We only support Google for now in this migration
      if (providerName === 'google') {
        await signInWithPopup(auth, googleProvider)
      } else {
        alert('Only Google login is supported in this Firebase migration.')
      }
    } catch (error) {
      console.error('Login Error:', error.message)
      alert(`Login failed: ${error.message}`)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const updateProfile = async (data) => {
    if (!auth.currentUser) return { error: 'No user' }

    try {
      await firebaseUpdateProfile(auth.currentUser, {
        displayName: data.username || user.username,
        photoURL: data.avatar || user.avatar
      })

      setUser(prev => ({
        ...prev,
        username: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL
      }))
      return { data: auth.currentUser }
    } catch (error) {
      return { error }
    }
  }

  // implemented avatar upload using Supabase Storage
  const uploadAvatar = async (file) => {
    if (!user) {
      alert("You must be logged in to upload an avatar.")
      return
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase 'avatars' bucket
      // Note: Make sure you have created a public bucket named 'avatars' in Supabase
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (error) throw error

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update Firebase Profile
      await updateProfile({ avatar: publicUrl })

      return { data: publicUrl }
    } catch (error) {
      console.error('Avatar Upload Error:', error)
      alert(`Avatar upload failed: ${error.message}`)
      return { error: error.message }
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, loginWithProvider, logout, updateProfile, uploadAvatar }}>
      {!loading && children}
    </UserContext.Provider>
  )
}
