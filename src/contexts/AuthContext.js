// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)

  // Fetch initial user
  const getInitialUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    const currentUser = data?.user ?? null
    setUser(currentUser)

    if (currentUser) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single()

      if (!profileError && profileData?.username) {
        setUsername(profileData.username)
      }
    }

    setLoading(false)
  }

  // Listen for visibility change or tab focus
  useEffect(() => {
    getInitialUser()
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        console.log("Auth event:", _event)
        console.log("Current user:", currentUser)
  
        setUser(currentUser)
  
        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single()
  
          if (!error && profileData?.username) {
            setUsername(profileData.username)
          }
        }
  
        setLoading(false)
      }
    )
  
    // 💡 Refresh session AND context when user returns
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await supabase.auth.getUser()
        const currentUser = data?.user ?? null
        setUser(currentUser)
  
        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single()
  
          if (!error && profileData?.username) {
            setUsername(profileData.username)
          }
        }
      }
    }
  
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)
  
    return () => {
      authListener.subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [])
  const value = { user, loading, username }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}