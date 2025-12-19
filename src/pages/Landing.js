import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function Landing() {
  const { user } = useContext(UserContext)

  return (
    <div className="landing christmas-landing">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="winter-scene-container" style={{ position: 'relative', zIndex: 5 }}>
        <div className="hero-section" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 2rem',
          marginTop: '10vh',
          textAlign: 'center'
        }}>
          <h1 className="hero-title-main" style={{ fontSize: '7.5rem', fontFamily: "'Mountains of Christmas', cursive" }}>
            Merry CampusConnect
          </h1>
          <p className="hero-subtitle-main" style={{ fontSize: '1.8rem', marginBottom: '3rem', opacity: 0.9 }}>
            The Most Satisfying 3D Winter Experience <i className="fas fa-snowflake"></i>
          </p>

          <Link to="/features" className="btn-christmas-premium" style={{ display: 'inline-block', width: 'auto' }}>
            START THE MAGIC <i className="fas fa-magic"></i>
          </Link>
        </div>

        <div className="floating-gift" style={{ position: 'absolute', left: '8%', top: '20%', fontSize: '4rem', color: '#ffd700' }}><i className="fas fa-gift"></i></div>
        <div className="floating-gift" style={{ position: 'absolute', right: '12%', top: '25%', fontSize: '5rem', color: '#ffd700' }}><i className="fas fa-tree"></i></div>
        <div className="floating-gift" style={{ position: 'absolute', left: '15%', bottom: '25%', fontSize: '3.5rem', color: '#ffd700' }}><i className="fas fa-star"></i></div>
      </div>

      <div className="container relative-z" style={{ marginTop: '4rem' }}>
        <h2 className="section-title">
          Winter Features
        </h2>

        <div className="simple-features-grid">
          <div className="simple-feature-card">
            <div className="feature-icon"><i className="fas fa-robot"></i></div>
            <h3>AI Smart Posts</h3>
            <p>Summarize notes with magic.</p>
          </div>

          <div className="simple-feature-card">
            <div className="feature-icon"><i className="fas fa-snowflake"></i></div>
            <h3>Zen Mode</h3>
            <p>Peaceful winter study vibes.</p>
          </div>

          <div className="simple-feature-card">
            <div className="feature-icon"><i className="fas fa-gift"></i></div>
            <h3>Rewards</h3>
            <p>Unwrap community gifts.</p>
          </div>
        </div>
      </div>

      <div className="cta-section" style={{ textAlign: 'center', padding: '8rem 2rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '4rem', color: '#fff', fontFamily: "'Mountains of Christmas', cursive", marginBottom: '1.5rem' }}>Join the Festive Campus! <i className="fas fa-user-friends"></i></h2>
        <p style={{ fontSize: '1.4rem', color: '#e0f7fa', marginBottom: '3.5rem' }}>Experience the holiday magic with your peers.</p>
        <Link to="/features" className="btn-christmas-premium" style={{ display: 'inline-block', width: 'auto' }}>
          Get Started <i className="fas fa-star"></i>
        </Link>
      </div>
    </div>
  )
}

export default Landing
