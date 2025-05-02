import React from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (!error) {
      alert('Check your email for confirmation!')
      navigate('/login')
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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

      {/* New Button */}
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