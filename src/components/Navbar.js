import { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Navbar() {
  const { user, login } = useContext(UserContext)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const location = useLocation()

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username.trim())
      setShowLogin(false)
      setUsername('')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 3rem', background: 'rgba(10, 20, 40, 0.85)', backdropFilter: 'blur(10px)',
      borderBottom: '2px solid rgba(255, 215, 0, 0.3)', position: 'sticky', top: 0, zIndex: 1000
    }}>
      <Link to="/" className="logo" style={{
        fontFamily: "'Mountains of Christmas', cursive", fontSize: '2.5rem',
        background: 'linear-gradient(to right, #ff4e50, #f9d423)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700'
      }}>
        🎄 CampusConnect
      </Link>

      <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
        {[
          { name: 'Home', path: '/' },
          { name: 'Features', path: '/features' },
          { name: "Santa's Dash", path: '/game' },
          { name: 'Contact', path: '/contact' },
          { name: 'Profile', path: '/profile' }
        ].map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              color: isActive(link.path) ? '#ffd700' : '#fff',
              fontSize: '1.1rem',
              fontWeight: '500',
              textDecoration: 'none',
              paddingBottom: '5px',
              borderBottom: isActive(link.path) ? '2px solid #ffd700' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src={user.avatar} alt={user.username} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ffd700' }} />
            <span style={{ color: '#fff', fontWeight: '600' }}>{user.username}</span>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="btn-christmas-premium" style={{ padding: '0.6rem 1.8rem', fontSize: '1rem' }}>
            Login 🎅
          </button>
        )}
      </div>

      {showLogin && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }} onClick={() => setShowLogin(false)}>
          <div className="glass-card" style={{ padding: '3rem', maxWidth: '400px', width: '90%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: "'Mountains of Christmas', cursive" }}>Join the Cheer! ❄️</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter Christmas Nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1.5rem', outline: 'none'
                }}
              />
              <button type="submit" className="btn-christmas-premium" style={{ width: '100%', border: 'none' }}>LOGIN ✨</button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
