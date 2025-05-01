import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import { supabase } from './supabaseClient'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, loading } = React.useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      <nav>
        <h2>COOK Meals Rankings</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 10 }}>Hi, {user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        {/* 🔒 Wrap Home in ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  )
}

export default App