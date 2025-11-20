import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { supabase } from '../../supabaseClient'

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY

function AISmartPosts() {
  const { user } = useContext(UserContext)
  const [input, setInput] = useState('')
  const [action, setAction] = useState('improve')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const processWithAI = async () => {
    if (!input.trim()) {
      alert('Please enter some text')
      return
    }

    if (!user) {
      alert('Please login first')
      return
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      alert('Please add your Gemini API key to .env file')
      return
    }

    setLoading(true)
    setResult('')

    try {
      let prompt = ''
      
      switch(action) {
        case 'improve':
          prompt = `Improve this text to make it clearer and more professional:\n\n${input}`
          break
        case 'expand':
          prompt = `Expand this text with more details and examples:\n\n${input}`
          break
        case 'summarize':
          prompt = `Summarize this text in 2-3 sentences:\n\n${input}`
          break
        case 'translate':
          prompt = `Translate this text to simple English:\n\n${input}`
          break
        default:
          prompt = input
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - Check your API key`)
      }

      const data = await response.json()
      const aiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI'
      setResult(aiResult)
    } catch (error) {
      setResult(`Error: ${error.message}\n\nPlease check:\n1. Your API key is correct\n2. You have internet connection\n3. Gemini API is enabled`)
      console.error('AI Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveAsPost = async () => {
    if (!result) return

    const { error } = await supabase
      .from('posts')
      .insert([{
        title: `AI Enhanced: ${input.substring(0, 50)}...`,
        content: result,
        category: 'Notes',
        author: user.username,
        likes: 0
      }])

    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      alert('Saved as post!')
      setInput('')
      setResult('')
    }
  }

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1>🤖 AI-Powered Smart Posts</h1>
        <p>Let AI help you write better content!</p>
      </div>

      <div className="ai-tool-container">
        <div className="input-section">
          <h3>Your Content</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            rows="10"
          />

          <div className="action-buttons">
            <button 
              className={action === 'improve' ? 'active' : ''}
              onClick={() => setAction('improve')}
            >
              ✨ Improve
            </button>
            <button 
              className={action === 'expand' ? 'active' : ''}
              onClick={() => setAction('expand')}
            >
              📝 Expand
            </button>
            <button 
              className={action === 'summarize' ? 'active' : ''}
              onClick={() => setAction('summarize')}
            >
              📋 Summarize
            </button>
            <button 
              className={action === 'translate' ? 'active' : ''}
              onClick={() => setAction('translate')}
            >
              🌐 Simplify
            </button>
          </div>

          <button 
            className="process-btn"
            onClick={processWithAI}
            disabled={loading}
          >
            {loading ? 'Processing...' : '🚀 Process with AI'}
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h3>AI Result</h3>
            <div className="result-box">
              {result}
            </div>
            <button className="save-btn" onClick={saveAsPost}>
              💾 Save as Post
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISmartPosts
