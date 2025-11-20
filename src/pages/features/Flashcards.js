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
    if (!content.trim()) {
      alert('Please enter some content')
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

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - Check your API key`)
      }

      const data = await response.json()
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      console.log('AI Response:', result)
      
      // Parse flashcards - try multiple formats
      let cards = []
      
      // Format 1: Q: question | A: answer
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
        } else if (line.match(/^\d+\./)) {
          // Format 2: 1. Question text
          const question = line.replace(/^\d+\./, '').trim()
          const nextLineIndex = lines.indexOf(line) + 1
          if (nextLineIndex < lines.length) {
            const answer = lines[nextLineIndex].replace(/^-|Answer:/gi, '').trim()
            if (question && answer) {
              cards.push({ question, answer })
            }
          }
        }
      }

      if (cards.length > 0) {
        setFlashcards(cards)
        setCurrentCard(0)
        setFlipped(false)
      } else {
        alert('Could not generate flashcards. The AI response format was unexpected. Try different content or simpler text.')
        console.error('Failed to parse:', result)
      }
    } catch (error) {
      alert(`Error: ${error.message}\n\nPlease check your API key and internet connection.`)
      console.error('Flashcards Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    setFlipped(false)
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
  }

  const prevCard = () => {
    setFlipped(false)
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1>📇 AI-Generated Flashcards</h1>
        <p>Convert any content into study flashcards!</p>
      </div>

      {flashcards.length === 0 ? (
        <div className="flashcard-input">
          <h3>Enter Content to Convert</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your tutorial, notes, or any learning content here..."
            rows="15"
          />
          <button 
            className="generate-btn"
            onClick={generateFlashcards}
            disabled={loading}
          >
            {loading ? 'Generating...' : '✨ Generate Flashcards'}
          </button>
        </div>
      ) : (
        <div className="flashcard-viewer">
          <div className="flashcard-counter">
            Card {currentCard + 1} of {flashcards.length}
          </div>

          <div 
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-front">
              <div className="card-label">Question</div>
              <div className="card-text">
                {flashcards[currentCard].question}
              </div>
              <div className="card-hint">Click to flip</div>
            </div>
            <div className="flashcard-back">
              <div className="card-label">Answer</div>
              <div className="card-text">
                {flashcards[currentCard].answer}
              </div>
              <div className="card-hint">Click to flip back</div>
            </div>
          </div>

          <div className="flashcard-controls">
            <button onClick={prevCard}>← Previous</button>
            <button onClick={() => setFlipped(!flipped)}>
              {flipped ? 'Show Question' : 'Show Answer'}
            </button>
            <button onClick={nextCard}>Next →</button>
          </div>

          <button 
            className="new-set-btn"
            onClick={() => {
              setFlashcards([])
              setContent('')
            }}
          >
            Create New Set
          </button>
        </div>
      )}
    </div>
  )
}

export default Flashcards
