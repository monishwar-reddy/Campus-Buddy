import { useState, useContext, useRef, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY

function AIChatbot() {
  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hi! I\'m your AI Doubt Solver. Ask me anything about programming, concepts, or campus topics!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    if (!user) {
      alert('Please login first')
      return
    }

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('AI Assistant is currently frosty. Please refresh!')
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful campus assistant. Answer this question clearly and concisely:\n\n${userMessage}`
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that.'

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `❌ Error: ${error.message}. Please check your Gemini API key in the .env file.` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="feature-page christmas-feature">
      {/* 1. Page Background & Overlay */}
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', maxWidth: '800px' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
            💬 Winter AI Assistant
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>Get instant festive help for all your doubts!</p>
        </div>

        <div className="glass-card-3d chat-container" style={{
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)', /* High transparency */
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '10px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  fontSize: '2rem',
                  background: 'rgba(255,255,255,0.1)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {msg.role === 'ai' ? '🤖' : '👤'}
                </div>
                <div style={{
                  maxWidth: '75%',
                  padding: '1rem 1.5rem',
                  borderRadius: '20px',
                  background: msg.role === 'ai' ? 'rgba(212, 20, 90, 0.2)' : 'rgba(46, 139, 87, 0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  lineHeight: '1.6'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>🤖</div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                  Typing magic... ✨
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container" style={{ display: 'flex', gap: '1rem' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your doubt here..."
              rows="2"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,215,0,0.3)',
                color: '#fff',
                padding: '1rem',
                borderRadius: '15px',
                flex: 1,
                resize: 'none',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-christmas-premium"
              style={{ padding: '0 2rem', fontSize: '1rem' }}
            >
              SEND ✨
            </button>
          </div>
        </div>

        <div className="quick-questions" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ffd700', marginBottom: '1rem' }}>Festive Prompts:</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="cat-btn"
              onClick={() => setInput('Explain React hooks')}
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', cursor: 'pointer', color: '#fff' }}
            >
              Explain React hooks
            </button>
            <button
              className="cat-btn"
              onClick={() => setInput('What is machine learning?')}
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', cursor: 'pointer', color: '#fff' }}
            >
              What is ML?
            </button>
            <button
              className="cat-btn"
              onClick={() => setInput('How to prepare for interviews?')}
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', cursor: 'pointer', color: '#fff' }}
            >
              Interview tips
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChatbot
