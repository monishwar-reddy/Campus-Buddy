import { Link } from 'react-router-dom'

function FeaturesPortal() {
  return (
    <div className="features-portal-page">
      {/* Floating Halloween Elements */}
      <div className="ghost ghost-1">👻</div>
      <div className="ghost ghost-2">👻</div>
      <div className="pumpkin pumpkin-1">🎃</div>
      <div className="bat bat-1">🦇</div>
      <div className="bat bat-2">🦇</div>

      <div className="portal-header">
        <h1 className="portal-title">
          🎃 Choose Your Feature Portal 🎃
        </h1>
        <p className="portal-subtitle">
          Click any portal to enter a magical feature realm!
        </p>
      </div>

      <div className="portals-grid">
        {/* Portal 1 - AI Smart Posts */}
        <Link to="/features/ai-smart-posts" className="portal-card-3d">
          <div className="portal-number">1</div>
          <div className="portal-icon">🤖</div>
          <h3>AI Smart Posts</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>

        {/* Portal 2 - AI Chatbot */}
        <Link to="/features/ai-chatbot" className="portal-card-3d">
          <div className="portal-number">2</div>
          <div className="portal-icon">💬</div>
          <h3>AI Chatbot</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>

        {/* Portal 3 - Flashcards */}
        <Link to="/features/flashcards" className="portal-card-3d">
          <div className="portal-number">3</div>
          <div className="portal-icon">📇</div>
          <h3>Flashcards</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>

        {/* Portal 4 - Leaderboard */}
        <Link to="/features/leaderboard" className="portal-card-3d">
          <div className="portal-number">4</div>
          <div className="portal-icon">🏆</div>
          <h3>Leaderboard</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>

        {/* Portal 5 - Projects */}
        <Link to="/features/projects" className="portal-card-3d">
          <div className="portal-number">5</div>
          <div className="portal-icon">🚀</div>
          <h3>Projects</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>

        {/* Portal 6 - Browse Posts */}
        <Link to="/feed" className="portal-card-3d">
          <div className="portal-number">6</div>
          <div className="portal-icon">📚</div>
          <h3>Browse Posts</h3>
          <div className="portal-enter">Enter Portal →</div>
        </Link>
      </div>
    </div>
  )
}

export default FeaturesPortal
