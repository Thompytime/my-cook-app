// src/components/Home.js
import React from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'

const Home = () => {
  const { user } = React.useContext(AuthContext)
  const [username, setUsername] = React.useState(null)

  React.useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Could not load username:', error)
        } else {
          setUsername(data.username)
        }
      }
    }

    fetchUsername()
  }, [user])

  return (
    <div className="home">
      <h1>Welcome to COOK Meals Rankings</h1>
      {user && (
  <h2>
    Hi, {username ? username : '...'}! Welcome to your COOK Meals Rankings Account
  </h2>
)}
    </div>
  )
}

export default Home