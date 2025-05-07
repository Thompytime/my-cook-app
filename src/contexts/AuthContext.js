// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)

  // Fetch initial user and username
  const getInitialUser = async () => {
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

    setLoading(false)
  }

  // Listen for auth changes
  useEffect(() => {
    getInitialUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        console.log("Auth event:", _event)
        console.log("Current user:", currentUser)

        setUser(currentUser)
        setUsername(null)

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

    // Optional: Refresh session when tab becomes visible again
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await supabase.auth.refreshSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      authListener.subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const value = { user, loading, username }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}