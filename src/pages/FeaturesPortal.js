import { Link } from 'react-router-dom'

function FeaturesPortal() {
  return (
    <div className="features-portal-page">
      {/* 1. Page Background & Overlay - Using Public Image */}
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="portal-header" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '4rem' }}>
        <h1 className="portal-title" style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
          ✨ Explore the Festive Portals ✨
        </h1>
        <p className="portal-subtitle" style={{ fontSize: '1.2rem', color: '#fff' }}>
          Choose a magical realm to enhance your campus experience!
        </p>
      </div>

      <div className="portals-grid container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Portal 1 - AI Smart Posts */}
        <Link to="/features/ai-smart-posts" className="glass-card-3d portal-card">
          <div className="portal-icon">🤖</div>
          <h3>AI Smart Posts</h3>
          <p>Let AI summarize your notes!</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>

        {/* Portal 2 - AI Chatbot */}
        <Link to="/features/ai-chatbot" className="glass-card-3d portal-card">
          <div className="portal-icon">💬</div>
          <h3>Winter Chatbot</h3>
          <p>Ask anything to your AI helper.</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>

        {/* Portal 3 - Flashcards */}
        <Link to="/features/flashcards" className="glass-card-3d portal-card">
          <div className="portal-icon">❄️</div>
          <h3>Icy Flashcards</h3>
          <p>Study with frosty efficiency.</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>

        {/* Portal 4 - Leaderboard */}
        <Link to="/features/leaderboard" className="glass-card-3d portal-card">
          <div className="portal-icon">🏆</div>
          <h3>Gift Board</h3>
          <p>See who is leading the cheer!</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>

        {/* Portal 5 - Browse Posts */}
        <Link to="/feed" className="glass-card-3d portal-card">
          <div className="portal-icon">🎁</div>
          <h3>Campus Gift Box</h3>
          <p>Browse all community notes & gifts.</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>

        {/* Portal 6 - Profile */}
        <Link to="/profile" className="glass-card-3d portal-card">
          <div className="portal-icon">👤</div>
          <h3>Winter Identity</h3>
          <p>View your festive contributions.</p>
          <div className="portal-enter">Start Magic →</div>
        </Link>
      </div>
    </div>
  )
}

export default FeaturesPortal
