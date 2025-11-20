import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Navbar() {
  const { user, login } = useContext(UserContext)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username.trim())
      setShowLogin(false)
      setUsername('')
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🎓 CampusConnect
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/game">Fun Game</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt={user.username} className="avatar-small" />
            <span>{user.username}</span>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="login-btn">
            Login
          </button>
        )}
      </div>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Login to CampusConnect</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
