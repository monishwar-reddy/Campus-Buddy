import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { UserProvider, UserContext } from './context/UserContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import FeaturesPortal from './pages/FeaturesPortal'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import PacManGame from './pages/PacManGame'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'

// Feature Pages
import AISmartPosts from './pages/features/AISmartPosts'
import AIChatbot from './pages/features/AIChatbot'
import Flashcards from './pages/features/Flashcards'
import Leaderboard from './pages/features/Leaderboard'
import Projects from './pages/features/Projects'

// Games
import GamesPortal from './pages/GamesPortal'
import TicTacToe from './pages/games/TicTacToe'
import Pong from './pages/games/Pong'
import Mario from './pages/games/Mario'

import './App.css'
import './components/ChristmasTheme/ChristmasTheme.css'
import Snowfall from './components/ChristmasTheme/Snowfall'
import CustomCursor from './components/ChristmasTheme/CustomCursor'

function AppContent() {
  const { user, loading } = useContext(UserContext)
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Login />
  }

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

          {/* Game Routes */}
          <Route path="/games" element={<GamesPortal />} />
          <Route path="/games/santa-dash" element={<PacManGame />} />
          <Route path="/game" element={<PacManGame />} /> {/* Legacy Redirect */}
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/pong" element={<Pong />} />
          <Route path="/games/mario" element={<Mario />} />

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
