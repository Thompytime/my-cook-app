import React from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      navigate('/')
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      {/* New Button */}
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/register')} style={{ background: 'none', color: '#3498db', cursor: 'pointer' }}>
          Create new account
        </button>
      </p>
    </div>
  )
}

export default Login