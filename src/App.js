import React from 'react'
import { Routes, Route, Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import { supabase } from './supabaseClient'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from './components/AuthCallback'

// Layout wrapper that includes side images
const LayoutWithSideImages = () => {
  return (
    <>
      {/* Logo above everything */}
      <div className="top-logo-container">
        <img
          src="/cooklogo.png"
          alt="COOK Logo"
          className="top-logo"
        />
      </div>

      {/* Main layout container */}
      <div className="main-layout">
        {/* Left Images */}
        <div className="side-images left-images">
          <img src="https://assets.cookfood.net/product_921_6564.jpg" alt="Moroccan Spiced Harissa Chicken" className="side-image" />
          <img src="https://assets.cookfood.net/product_2283_6259.jpg" alt="Creamy Chicken with Mushrooms & Bacon" className="side-image" />
          <img src="https://assets.cookfood.net/product_588_6243.jpg" alt="Coq au Vin" className="side-image" />
        </div>

        {/* Center Content Wrapper */}
        <div className="center-wrapper">
          <div className="center-content">
            <Outlet /> {/* This renders Login/Register/Home */}
          </div>

          {/* Description below form */}
          <div className="form-description">
            <p>
              Welcome to COOK Meals Rankings! Log in or register to rate our meals, share photos of where you enjoyed them,
              offer critiques, suggest side dishes, and even post your own creative twists.
              Share your COOK memories on social media!
            </p>
          </div>
        </div>

        {/* Right Images */}
        <div className="side-images right-images">
          <img src="https://assets.cookfood.net/product_2050_5229.jpg" alt="Chicken, Pea & Bacon Risotto" className="side-image" />
          <img src="https://assets.cookfood.net/product_1692_6810.jpg" alt="Chicken & Portobello Mushroom Pie" className="side-image" />
          <img src="https://assets.cookfood.net/product_1764_6815.jpg" alt="Spring Chicken & Asparagus Pie" className="side-image" />
        </div>
      </div>
    </>
  )
}
function App() {
  const { user, loading, username } = React.useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav>
        <h2>COOK Meals Rankings</h2>
        <div>
        {user ? (
        <>
          <span style={{ marginRight: 10 }}>
            Hi, {username ? username : '...'}
          </span>
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

      {/* Routes wrapped in LayoutWithSideImages */}
      <Routes>
        <Route element={<LayoutWithSideImages />}>
          {/* Protected home route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App