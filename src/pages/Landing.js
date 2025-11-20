import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Landing() {
  const { user } = useContext(UserContext)

  return (
    <div className="landing">
      {/* Floating Ghosts */}
      <div className="ghost ghost-1">👻</div>
      <div className="ghost ghost-2">👻</div>
      <div className="ghost ghost-3">👻</div>
      
      {/* Floating Pumpkins */}
      <div className="pumpkin pumpkin-1">🎃</div>
      <div className="pumpkin pumpkin-2">🎃</div>
      
      {/* Bats */}
      <div className="bat bat-1">🦇</div>
      <div className="bat bat-2">🦇</div>
      <div className="bat bat-3">🦇</div>

      {/* Main Content */}
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="title-line">🎃 CampusConnect 🎃</span>
            <span className="title-subtitle">Spooky Smart Campus Network</span>
          </h1>
          
          <p className="hero-description">
            Join the most haunted campus community powered by AI magic! 
            Share notes, ask doubts, find opportunities - all with a spooky twist! 👻
          </p>

          <div className="hero-buttons">
            <Link to="/features" className="btn-primary">
              Get Started 🚀
            </Link>
          </div>
        </div>

        {/* Simple Feature Cards - No Links */}
        <div className="features-section">
          <h2 className="section-title">
            ✨ Key Features
          </h2>
          
          <div className="simple-features-grid">
            <div className="simple-feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Smart Posts</h3>
            </div>

            <div className="simple-feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI Chatbot</h3>
            </div>

            <div className="simple-feature-card">
              <div className="feature-icon">📇</div>
              <h3>Flashcards</h3>
            </div>

            <div className="simple-feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leaderboard</h3>
            </div>

            <div className="simple-feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Projects</h3>
            </div>

            <div className="simple-feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>AI Moderation</h3>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">🎃</div>
            <div className="stat-label">Spooky Theme</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">🤖</div>
            <div className="stat-label">AI Powered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">⚡</div>
            <div className="stat-label">Lightning Fast</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">🔒</div>
            <div className="stat-label">Secure</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Join the Spooky Campus? 👻</h2>
          <p>Connect with your peers in the most haunted way possible!</p>
          <Link to="/features" className="btn-cta">
            Get Started Now 🚀
          </Link>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="bg-web web-1"></div>
      <div className="bg-web web-2"></div>
      <div className="bg-web web-3"></div>
    </div>
  )
}

export default Landing
