const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY

export async function moderateContent(text) {
  const BAD_WORDS = ["spam", "scam", "fake", "badword", "misinformation", "hate", "abuse"]
  const lowerText = text.toLowerCase()
  const flagged = BAD_WORDS.some(word => lowerText.includes(word))
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return { flagged, reason: flagged ? 'Contains inappropriate content' : null }
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this text for spam, toxicity, or inappropriate content. Reply with only "FLAGGED" or "SAFE":\n\n${text}`
          }]
        }]
      })
    })
    
    if (!response.ok) {
      console.log('Gemini API error:', response.status, '- using fallback')
      return { flagged, reason: flagged ? 'Contains inappropriate content' : null }
    }
    
    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    return { flagged: result === 'FLAGGED', reason: result === 'FLAGGED' ? 'AI detected inappropriate content' : null }
  } catch (err) {
    console.log('Gemini API unavailable, using fallback moderation')
    return { flagged, reason: flagged ? 'Contains inappropriate content' : null }
  }
}

export async function summarizePost(content) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here' || content.length < 200) {
    return null
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize this in one short sentence (max 15 words):\n\n${content}`
          }]
        }]
      })
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  } catch (err) {
    return null
  }
}

export async function autoTagPost(title, content) {
  const text = `${title} ${content}`.toLowerCase()
  
  if (text.includes('note') || text.includes('study') || text.includes('exam')) return 'Notes'
  if (text.includes('doubt') || text.includes('help') || text.includes('question')) return 'Doubts'
  if (text.includes('job') || text.includes('internship') || text.includes('opportunity')) return 'Opportunities'
  if (text.includes('event') || text.includes('workshop') || text.includes('seminar')) return 'Events'
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return 'General'
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Categorize this post into ONE of these: Notes, Doubts, Opportunities, Events, General. Reply with only the category name:\n\nTitle: ${title}\nContent: ${content}`
          }]
        }]
      })
    })
    
    if (!response.ok) return 'General'
    
    const data = await response.json()
    const category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    const validCategories = ['Notes', 'Doubts', 'Opportunities', 'Events', 'General']
    return validCategories.includes(category) ? category : 'General'
  } catch (err) {
    return 'General'
  }
}
