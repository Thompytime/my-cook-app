import React from 'react'
import { AuthContext } from '../contexts/AuthContext'

const Home = () => {
  const { user } = React.useContext(AuthContext)

  return (
    <div className="home">
      <h1>Welcome to COOK Meals Rankings</h1>
      {user && (
        <h2>
          Hi, {user.email}! Welcome to your COOK Meals Rankings Account
        </h2>
      )}
    </div>
  )
}

export default Home