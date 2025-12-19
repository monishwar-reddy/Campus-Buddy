import { Link } from 'react-router-dom'

function FeaturesPortal() {
  return (
    <div className="features-portal-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="portal-header container" style={{ position: 'relative', zIndex: 10, paddingTop: '6rem' }}>
        <h1 className="section-title">
          Winter Magic Portal
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '5rem', opacity: 0.9 }}>
          Explore the festive tools enchanted for your campus life.
        </p>
      </div>

      <div className="container relative-z">
        <div className="portals-grid">
          <Link to="/features/ai-smart-posts" className="portal-card">
            <div className="portal-icon"><i className="fas fa-robot"></i></div>
            <h3>AI Smart Posts</h3>
            <p>Let AI summarize your notes into festive gifts!</p>
            <div className="portal-enter">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>

          <Link to="/features/ai-chatbot" className="portal-card">
            <div className="portal-icon"><i className="fas fa-comment-dots"></i></div>
            <h3>Winter Chatbot</h3>
            <p>Ask anything to your jolly AI campus helper.</p>
            <div className="portal-enter">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>

          <Link to="/features/flashcards" className="portal-card">
            <div className="portal-icon"><i className="fas fa-snowflake"></i></div>
            <h3>Icy Flashcards</h3>
            <p>Crystal clear study sessions for your exams.</p>
            <div className="portal-enter">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>

          <Link to="/features/leaderboard" className="portal-card">
            <div className="portal-icon"><i className="fas fa-trophy"></i></div>
            <h3>Gift Board</h3>
            <p>See who is leading the holiday cheer ranking!</p>
            <div className="portal-enter">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>

          <Link to="/feed" className="portal-card">
            <div className="portal-icon"><i className="fas fa-gift"></i></div>
            <h3>Campus Gift Box</h3>
            <p>Browse community notes, doubts, and festive gifts.</p>
            <div className="portal-enter">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>

          <Link to="/profile" className="portal-card">
            <div className="portal-icon"><i className="fas fa-user-circle"></i></div>
            <h3>Winter Identity</h3>
            <p>View your festive contributions and profile.</p>
            <div className="portal-enter profile">Start Magic <i className="fas fa-arrow-right"></i></div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPortal
