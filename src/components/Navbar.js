import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Navbar() {
  const { user, logout } = useContext(UserContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <i className="fas fa-tree"></i> CampusConnect
      </Link>

      <div className="nav-links">
        {[
          { name: 'Home', path: '/' },
          { name: 'Features', path: '/features' },
          { name: "Games", path: '/games' },
          { name: 'Contact', path: '/contact' },
          { name: 'Profile', path: '/profile' }
        ].map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-info">
            <div className="avatar-wrapper">
              <img src={user.avatar} alt={user.username} className="nav-avatar" />
            </div>
            <span className="nav-username">{user.username}</span>
            <button onClick={logout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        ) : (
          <Link to="/" className="logout-btn" style={{ textDecoration: 'none' }}>
            Login <i className="fas fa-sign-in-alt"></i>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
