import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY

function Flashcards() {
  const { user } = useContext(UserContext)
  const [content, setContent] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const generateFlashcards = async () => {
    if (!content.trim()) { alert('Please enter some content'); return }
    if (!user) { alert('Please login first'); return }
    if (!GEMINI_API_KEY) {
      alert('AI study assistant is warming up... try again!'); return
    }

    setLoading(true)

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create exactly 5 flashcards from this content. Format STRICTLY as:
Q: [question here] | A: [answer here]

Example:
Q: What is React? | A: A JavaScript library for building user interfaces

Now create 5 flashcards from this content:

${content}`
            }]
          }]
        })
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      let cards = []
      const lines = result.split('\n').filter(line => line.trim())
      for (let line of lines) {
        if (line.includes('Q:') && line.includes('A:')) {
          const parts = line.split('|')
          if (parts.length >= 2) {
            cards.push({
              question: parts[0].replace(/Q:|Question:/gi, '').trim(),
              answer: parts[1].replace(/A:|Answer:/gi, '').trim()
            })
          }
        }
      }

      if (cards.length > 0) {
        setFlashcards(cards)
        setCurrentCard(0)
        setFlipped(false)
      } else {
        alert('Could not generate flashcards. Try different content.')
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => { setFlipped(false); setCurrentCard((prev) => (prev + 1) % flashcards.length) }
  const prevCard = () => { setFlipped(false); setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length) }

  return (
    <div className="feature-page christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
            📇 Winter Flashcards
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>Icy efficient study tools for your winter exams!</p>
        </div>

        {flashcards.length === 0 ? (
          <div className="glass-card-3d" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem', background: 'rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#ffd700' }}>Enter Content to Convert</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your tutorial, notes, or any learning content here..."
              rows="12"
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '1.5rem', borderRadius: '15px', resize: 'none', outline: 'none', marginBottom: '2rem' }}
            />
            <button
              className="btn-christmas-premium"
              onClick={generateFlashcards}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Frosted Magic Loading...' : 'GENERATE STUDY GIFTS ✨'}
            </button>
          </div>
        ) : (
          <div className="flashcard-viewer" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem', color: '#ffd700', fontSize: '1.2rem' }}>
              Gift {currentCard + 1} of {flashcards.length}
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              style={{
                height: '350px', position: 'relative', cursor: 'pointer', perspective: '1000px', marginBottom: '3rem'
              }}
            >
              <div style={{
                width: '100%', height: '100%', transition: 'transform 0.6s', transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Front */}
                <div className="glass-card-3d" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem',
                  border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#ffd700', marginBottom: '1rem', textTransform: 'uppercase' }}>Ice Question ❄️</div>
                  <div style={{ fontSize: '1.8rem', color: '#fff' }}>{flashcards[currentCard].question}</div>
                  <div style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>Click to flip</div>
                </div>

                {/* Back */}
                <div className="glass-card-3d" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem',
                  border: '2px solid rgba(46, 139, 87, 0.4)', background: 'rgba(46, 139, 87, 0.1)', transform: 'rotateY(180deg)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#3cb371', marginBottom: '1rem', textTransform: 'uppercase' }}>Winter Answer 🎁</div>
                  <div style={{ fontSize: '1.8rem', color: '#fff' }}>{flashcards[currentCard].answer}</div>
                  <div style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>Click to flip back</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button onClick={prevCard} className="btn-secondary" style={{ padding: '0.8rem 2rem' }}>Back</button>
              <button onClick={nextCard} className="btn-secondary" style={{ padding: '0.8rem 2rem' }}>Next</button>
            </div>

            <button
              className="btn-christmas-premium"
              onClick={() => { setFlashcards([]); setContent('') }}
              style={{ background: 'transparent', border: 'none', color: '#ffd700', textDecoration: 'underline' }}
            >
              Start New Study Session ✨
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Flashcards
