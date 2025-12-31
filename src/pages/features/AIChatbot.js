import { useState, useContext, useRef, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'

import { callGemini } from '../../utils/gemini'

function AIChatbot() {
  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m your AI Doubt Solver. Ask me anything about programming, concepts, or campus topics!' }
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
    if (!user) { alert('Please login first'); return }

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const systemPrompt = `You are a helpful campus assistant. Answer this question clearly and concisely:\n\n${userMessage}`;
      const aiResponse = await callGemini(systemPrompt);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Sorry, I couldn't process that." }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message}.` }])
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
    <div className="feature-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem', maxWidth: '900px' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">
            <i className="fas fa-comment-dots"></i> Winter AI Assistant
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fff', opacity: 0.9 }}>Get instant festive help for all your doubts!</p>
        </div>

        <div className="post-card chat-container" style={{
          height: '650px',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          alignItems: 'stretch',
          textAlign: 'left'
        }}>
          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1.2rem',
                marginBottom: '1.5rem',
                flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  background: msg.role === 'ai' ? 'var(--christmas-red)' : 'var(--christmas-green)',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  <i className={msg.role === 'ai' ? "fas fa-robot" : "fas fa-user"}></i>
                </div>
                <div style={{
                  maxWidth: '80%',
                  padding: '1.2rem 1.8rem',
                  borderRadius: '20px',
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--christmas-red)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <i className="fas fa-robot"></i>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: '#ffd700' }}>
                  <i className="fas fa-spinner fa-spin"></i> Typing magic...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container" style={{ display: 'flex', gap: '1rem' }}>
            <textarea
              className="festive-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your doubt here..."
              rows="1"
              style={{ flex: 1, height: 'auto', minHeight: '60px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-christmas-premium"
              style={{ padding: '0 2.5rem', fontSize: '1.1rem', width: 'auto' }}
            >
              SEND <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <div className="quick-questions" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#ffd700', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Festive Prompts:</p>
          <div className="categories-tray">
            {['Explain React hooks', 'What is Machine Learning?', 'Interview tips', 'Write a Christmas poem'].map(prompt => (
              <button
                key={prompt}
                className="cat-btn"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChatbot
