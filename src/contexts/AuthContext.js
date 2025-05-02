import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const getInitialUser = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        // Fetch username from profiles table
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

    getInitialUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        console.log("User:", currentUser) // 👈 Log current user
        console.log("Session event:", _event) // 👈 Log event type
    
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

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = { user, loading, username }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}