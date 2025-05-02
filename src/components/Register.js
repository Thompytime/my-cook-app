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

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
      return
    }

    if (data?.user) {
      const userId = data.user.id

      // Insert profile into Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: username,
          email: email,
          created_at: new Date(),
        })

      if (profileError) {
        alert("Could not save your profile")
        console.error(profileError)
        return
      }

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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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