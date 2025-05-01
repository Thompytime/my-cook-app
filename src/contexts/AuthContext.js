import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.session()
    setUser(session?.user ?? null)
    setLoading(false)

    const { data: authListener } = supabase.auth.onAuthStateChanges(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  const value = { user, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}