// src/components/Register.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Register = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    // Step 1: Sign up user
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(`Registration failed: ${error.message}`)
      return
    }

    if (data?.user) {
      let currentUser = null
      let tries = 0

      // Step 2: Wait for Supabase auth session to be ready
      while (!currentUser && tries < 5) {
        const { data: userData } = await supabase.auth.getUser()
        currentUser = userData?.user
        tries++
        if (!currentUser) await new Promise((res) => setTimeout(res, 1000)) // wait 1s
      }

      if (!currentUser) {
        alert("Authentication timed out. Please try again.")
        return
      }

      const userId = currentUser.id

      // Step 3: Insert profile into Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: username,
          email: email,
          created_at: new Date(),
        })

      if (profileError) {
        console.error('Profile insert error:', profileError)
        alert(`Could not save your profile: ${profileError.message}`)
        return
      }

      // Step 4: Success!
      alert('Check your email for confirmation!')
      navigate('/login')
    }
  }

  return (
    <div className="registration-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ background: 'none', color: '#3498db', cursor: 'pointer' }}>
          Log in
        </button>
      </p>
    </div>
  )
}

export default Register