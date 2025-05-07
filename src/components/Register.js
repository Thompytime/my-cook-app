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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) {
      alert(`Registration failed: ${error.message}`)
      return
    }

    if (data?.user) {
      alert('Check your email for confirmation!')
      navigate('/login')
    } else {
      alert('Check your email to complete registration.')
      navigate('/login')
    }
  }

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
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
    </>
  )
}

export default Register