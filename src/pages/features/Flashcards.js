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
    <div className="feature-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">
            <i className="fas fa-snowflake"></i> Winter Flashcards
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fff', opacity: 0.9 }}>Icy efficient study tools for your winter exams!</p>
        </div>

        {flashcards.length === 0 ? (
          <div className="post-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3.5rem', alignItems: 'flex-start' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Enter Content to Convert</h3>
            <textarea
              className="festive-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your tutorial, notes, or any learning content here..."
              rows="10"
              style={{ marginBottom: '2.5rem', height: 'auto' }}
            />
            <button
              className="btn-christmas-premium"
              onClick={generateFlashcards}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Magic Loading...' : <>GENERATE STUDY GIFTS <i className="fas fa-magic"></i></>}
            </button>
          </div>
        ) : (
          <div className="flashcard-viewer" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem', color: '#ffd700', fontSize: '1.3rem', fontWeight: 600 }}>
              <i className="fas fa-gift"></i> Gift {currentCard + 1} of {flashcards.length}
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              style={{
                height: '400px', position: 'relative', cursor: 'pointer', perspective: '1000px', marginBottom: '3.5rem'
              }}
            >
              <div style={{
                width: '100%', height: '100%', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Front */}
                <div className="post-card" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem',
                  border: '2px solid var(--christmas-gold)', background: 'var(--midnight-blue)'
                }}>
                  <div style={{ fontSize: '1rem', color: 'var(--christmas-gold)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <i className="fas fa-question-circle"></i> Ice Question
                  </div>
                  <div style={{ fontSize: '2rem', color: '#fff', fontWeight: 500 }}>{flashcards[currentCard].question}</div>
                  <div style={{ marginTop: '3rem', opacity: 0.5, fontSize: '0.9rem' }}>Click to unwrap...</div>
                </div>

                {/* Back */}
                <div className="post-card" style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem',
                  border: '2px solid var(--christmas-green)', background: 'rgba(22, 91, 51, 0.2)', transform: 'rotateY(180deg)'
                }}>
                  <div style={{ fontSize: '1rem', color: '#ffd700', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <i className="fas fa-gift"></i> Winter Answer
                  </div>
                  <div style={{ fontSize: '2rem', color: '#fff', fontWeight: 500 }}>{flashcards[currentCard].answer}</div>
                  <div style={{ marginTop: '3rem', opacity: 0.5, fontSize: '0.9rem' }}>Click to flip back</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
              <button onClick={prevCard} className="logout-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
              <button onClick={nextCard} className="logout-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'var(--christmas-green)' }}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <button
              className="btn-christmas-premium"
              onClick={() => { setFlashcards([]); setContent('') }}
              style={{ background: 'transparent', border: 'none', color: '#ffd700', textDecoration: 'underline', width: 'auto' }}
            >
              Start New Study Session <i className="fas fa-redo"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Flashcards
