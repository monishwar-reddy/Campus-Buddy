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

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Please add your Gemini API key to .env file' }])
      return
    }

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
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
      setMessages(prev => [...prev, { role: 'ai', text: `❌ Error: ${error.message}\n\nPlease check your API key and internet connection.` }])
      console.error('Chatbot Error:', error)
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
      <div className="feature-header">
        <h1>💬 AI Doubt Solver Chatbot</h1>
        <p>Get instant answers to your questions!</p>
      </div>

      <div className="chatbot-container">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'ai' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="message-avatar">🤖</div>
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your doubt here..."
            rows="3"
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send 🚀
          </button>
        </div>

        <div className="quick-questions">
          <p>Quick questions:</p>
          <button onClick={() => setInput('Explain React hooks')}>Explain React hooks</button>
          <button onClick={() => setInput('What is machine learning?')}>What is ML?</button>
          <button onClick={() => setInput('How to prepare for interviews?')}>Interview tips</button>
        </div>
      </div>
    </div>
  )
}

export default AIChatbot
