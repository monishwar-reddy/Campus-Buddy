import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import FeaturesPortal from './pages/FeaturesPortal'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import PacManGame from './pages/PacManGame'
import ContactUs from './pages/ContactUs'

// Feature Pages
import AISmartPosts from './pages/features/AISmartPosts'
import AIChatbot from './pages/features/AIChatbot'
import Flashcards from './pages/features/Flashcards'
import Leaderboard from './pages/features/Leaderboard'
import Projects from './pages/features/Projects'

import './App.css'
import './components/ChristmasTheme/ChristmasTheme.css'
import Snowfall from './components/ChristmasTheme/Snowfall'
import CustomCursor from './components/ChristmasTheme/CustomCursor'

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/' || location.pathname === '/features'

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<FeaturesPortal />} />
          <Route path="/feed" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />

          {/* Feature Routes */}
          <Route path="/features/ai-smart-posts" element={<AISmartPosts />} />
          <Route path="/features/ai-chatbot" element={<AIChatbot />} />
          <Route path="/features/flashcards" element={<Flashcards />} />
          <Route path="/features/leaderboard" element={<Leaderboard />} />
          <Route path="/features/projects" element={<Projects />} />

          {/* Fun Game */}
          <Route path="/game" element={<PacManGame />} />

          {/* Contact Us */}
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <Snowfall />
      <CustomCursor />
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  )
}

export default App
