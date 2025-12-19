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
    if (!input.trim()) { alert('Please enter some text'); return }
    if (!user) { alert('Please login first'); return }
    if (!GEMINI_API_KEY) {
      alert('AI magic is loading... please try again!'); return
    }

    setLoading(true); setResult('')

    try {
      let prompt = ''
      switch (action) {
        case 'improve': prompt = `Improve this text to make it clearer and more professional:\n\n${input}`; break
        case 'expand': prompt = `Expand this text with more details and examples:\n\n${input}`; break
        case 'summarize': prompt = `Summarize this text in 2-3 sentences:\n\n${input}`; break
        case 'translate': prompt = `Translate this text to simple English:\n\n${input}`; break
        default: prompt = input
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      const aiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI'
      setResult(aiResult)
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const saveAsPost = async () => {
    if (!result) return
    const { error } = await supabase.from('posts').insert([{
      title: `AI Enhanced: ${input.substring(0, 30)}...`,
      content: result,
      category: 'Notes',
      author: user.username,
      likes: 0
    }])
    if (error) alert('Error saving: ' + error.message)
    else { alert('Saved to Winter Chronicles! 🎄'); setInput(''); setResult('') }
  }

  return (
    <div className="feature-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">
            <i className="fas fa-robot"></i> AI Winter Scribe
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fff', opacity: 0.9 }}>
            Let AI polish your festive notes and projects!
          </p>
        </div>

        <div className="ai-tool-grid" style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="post-card" style={{ padding: '3rem', alignItems: 'flex-start' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Your Input</h3>
            <textarea
              className="festive-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              rows="8"
              style={{ marginBottom: '2rem', height: 'auto', resize: 'vertical' }}
            />

            <div className="categories-tray" style={{ marginBottom: '2.5rem', justifyContent: 'flex-start', width: '100%' }}>
              {['improve', 'expand', 'summarize', 'translate'].map(a => (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`cat-btn ${action === a ? 'active' : ''}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {a === 'translate' ? 'Simplify' : a}
                </button>
              ))}
            </div>

            <button
              className="btn-christmas-premium"
              onClick={processWithAI}
              disabled={loading}
            >
              {loading ? 'Magic in progress...' : <>ENHANCE MAGIC <i className="fas fa-wand-sparkles"></i></>}
            </button>
          </div>

          {result && (
            <div className="post-card" style={{ padding: '3rem', alignItems: 'flex-start' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>AI Gift <i className="fas fa-gift"></i></h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '15px', minHeight: '300px', color: '#fff', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-wrap', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                {result}
              </div>
              <button className="btn-christmas-premium" onClick={saveAsPost} style={{ background: 'var(--christmas-green)', width: '100%' }}>
                SHARE AS GIFT <i className="fas fa-snowflake"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AISmartPosts
