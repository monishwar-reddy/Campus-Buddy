import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Landing() {
  const { user } = useContext(UserContext)

  return (
    <div className="landing christmas-landing">
      {/* 1. Page Background & Overlay - Using Public Image */}
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      {/* 2. Winter Scene Elements */}
      <div className="winter-scene-container" style={{ position: 'relative', zIndex: 5 }}>
        {/* We now use global Snowfall for atmosphere */}


        {/* Hero Content */}
        <div className="hero-section" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '4rem',
          marginTop: '15vh',
          textAlign: 'center'
        }}>
          <h1 className="hero-title-main" style={{ fontSize: '7rem', fontFamily: "'Mountains of Christmas', cursive" }}>
            Merry CampusConnect
          </h1>
          <p className="hero-subtitle-main" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            The Most Satisfying 3D Winter Experience ❄️
          </p>

          <Link to="/features" className="btn-christmas-premium">
            START THE MAGIC ✨
          </Link>
        </div>

        {/* Floating Decor */}
        <div className="floating-gift" style={{ position: 'absolute', left: '10%', top: '20%', fontSize: '3rem' }}>🎁</div>
        <div className="floating-gift" style={{ position: 'absolute', right: '15%', top: '30%', fontSize: '4rem' }}>🎄</div>
        <div className="floating-gift" style={{ position: 'absolute', left: '20%', bottom: '30%', fontSize: '3rem' }}>⭐</div>
      </div>

      {/* 3. Features Section */}
      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
        <h2 className="section-title text-christmas" style={{
          fontFamily: "'Mountains of Christmas', cursive",
          fontSize: '5rem !important',
          marginBottom: '3rem',
          textAlign: 'center',
          color: '#ffd700'
        }}>
          Winter Features
        </h2>

        <div className="simple-features-grid">
          <div className="glass-card-3d simple-feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Smart Posts</h3>
          </div>

          <div className="glass-card-3d simple-feature-card">
            <div className="feature-icon">❄️</div>
            <h3>Zen Mode</h3>
          </div>

          <div className="glass-card-3d simple-feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Rewards</h3>
          </div>

          <div className="glass-card-3d simple-feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Leaderboard</h3>
          </div>
        </div>
      </div>

      {/* 4. CTA Section */}
      <div className="cta-section" style={{ textAlign: 'center', padding: '5rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '3rem', color: '#fff' }}>Join the Festive Campus! 🎅</h2>
        <p style={{ fontSize: '1.2rem', color: '#e0e0e0', marginBottom: '2rem' }}>Experience the holiday magic with your peers.</p>
        <Link to="/features" className="btn-christmas-premium">
          Get Started ✨
        </Link>
      </div>
    </div>
  )
}

export default Landing
