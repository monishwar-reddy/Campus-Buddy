import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { supabase } from '../../supabaseClient'
import { callGemini } from '../../utils/gemini'

function AISmartPosts() {
  const { user } = useContext(UserContext)
  const [input, setInput] = useState('')
  const [action, setAction] = useState('improve')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const processWithAI = async () => {
    if (!input.trim()) { alert('Please enter some text'); return }
    if (!user) { alert('Please login first'); return }

    setLoading(true); setResult('')

    try {
      let prompt = ''
      const constraint = " Keep the response concise (max 60 words) and plain text (no markdown)."
      switch (action) {
        case 'improve': prompt = `Improve this text to make it clearer and more professional:${constraint}\n\n${input}`; break
        case 'expand': prompt = `Expand this text slightly with ONE detail:${constraint}\n\n${input}`; break
        case 'summarize': prompt = `Summarize this text in 1 sentence:${constraint}\n\n${input}`; break
        case 'translate': prompt = `Translate this text to simple English:${constraint}\n\n${input}`; break
        default: prompt = input + constraint
      }

      // Race AI against a timeout for better UX
      const aiPromise = callGemini(prompt);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI timed out")), 8000));

      const aiResult = await Promise.race([aiPromise, timeoutPromise]);

      // Strip markdown stars just in case
      setResult(aiResult ? aiResult.replace(/\*\*/g, '') : 'No response from AI')
    } catch (error) {
      console.error(error)
      if (error.message.includes('configuration is missing')) {
        alert('AI Configuration Error: Please check .env file and restart server.')
        setResult('Configuration Missing')
      } else if (error.message === "AI timed out") {
        setResult("AI seems busy due to holiday traffic 🎅. Please try again.")
      } else {
        setResult(`Error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const saveAsPost = async () => {
    if (!result) return

    setSending(true)
    console.log("Attempting to save post to Supabase...")

    try {
      const { error } = await supabase.from('posts').insert([{
        title: `AI Enhanced: ${input.substring(0, 30)}...`,
        content: result,
        category: 'Notes',
        author: user.username || 'Anonymous',
        // Let Supabase handle created_at, likes, etc.
      }])

      if (error) throw error

      console.log("Post saved successfully")
      alert('Gift has been sent to the Winter Feed! 🎁')

      // Navigate to feed after success
      window.location.href = '/feed'

    } catch (error) {
      console.error("Save error:", error)
      alert('Error saving: ' + error.message)
      setSending(false)
    }
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
              {loading ? 'Enhancing...' : <>ENHANCE TEXT <i className="fas fa-magic"></i></>}
            </button>
          </div>

          {result && (
            <div className="post-card" style={{ padding: '3rem', alignItems: 'flex-start' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>AI Gift <i className="fas fa-gift"></i></h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '15px', minHeight: '300px', color: '#fff', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-wrap', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                {result}
              </div>
              <button
                className="btn-christmas-premium"
                onClick={saveAsPost}
                disabled={sending}
                style={{
                  background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
                  width: '100%',
                  color: '#000',
                  fontWeight: '800',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: sending ? 0.7 : 1,
                  cursor: sending ? 'wait' : 'pointer'
                }}
              >
                {sending ? 'Sending Gift...' : 'Send as Gift'} <i className="fas fa-gift" style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AISmartPosts
