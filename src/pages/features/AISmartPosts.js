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
    <div className="feature-page christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
            🤖 AI Winter Scribe
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>Let AI polish your festive notes and projects!</p>
        </div>

        <div className="ai-tool-grid" style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          <div className="glass-card-3d" style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffd700' }}>Your Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              rows="10"
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '1rem', borderRadius: '15px', resize: 'none', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
              {['improve', 'expand', 'summarize', 'translate'].map(a => (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer',
                    background: action === a ? 'var(--christmas-red)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textTransform: 'capitalize'
                  }}
                >
                  {a === 'translate' ? 'Simplify' : a}
                </button>
              ))}
            </div>

            <button
              className="btn-christmas-premium"
              onClick={processWithAI}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Magic in progress...' : 'ENHANCE MAGIC ✨'}
            </button>
          </div>

          {result && (
            <div className="glass-card-3d" style={{ padding: '2rem', background: 'rgba(46, 139, 87, 0.1)', animation: 'slideUp 0.4s' }}>
              <h3 style={{ marginBottom: '1rem', color: '#ffd700' }}>AI Gift 🎁</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '15px', minHeight: '300px', color: '#fff', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {result}
              </div>
              <button className="btn-christmas-premium" onClick={saveAsPost} style={{ width: '100%', background: 'linear-gradient(135deg, #2e8b57 0%, #3cb371 100%)' }}>
                SHARE AS GIFT ❄️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AISmartPosts
