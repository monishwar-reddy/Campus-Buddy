import { datadogRum } from '@datadog/browser-rum';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY

// Generic helper to ensure we use the same model configuration everywhere
export async function callGemini(prompt, retries = 3) {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API Key missing")
    throw new Error("AI configuration is missing")
  }

  const startTime = Date.now();
  // TELEMETRY: Track when AI is called (for Datadog Dashboard)
  datadogRum.addAction('ai_request_start', {
    model: 'gemini-2.5-flash',
    prompt_length: prompt.length
  });

  // Model requested by user: gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })

      if (!response.ok) {
        // dynamic error handling
        if (response.status === 429) {
          console.warn(`Gemini 429 Rate Limit (Attempt ${i + 1}/${retries}). Retrying...`)
          // Exponential backoff: 1s, 2s, 4s...
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)))
          continue;
        }

        console.error(`Gemini Error: ${response.status} ${response.statusText}`)
        throw new Error(`AI Service Error: ${response.status}`)
      }

      const data = await response.json()

      // TELEMETRY: Track Success & Speed
      datadogRum.addAction('ai_request_success', {
        duration_ms: Date.now() - startTime,
        response_length: data.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0
      });

      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    } catch (error) {
      // Telemetry: Track Error
      datadogRum.addError(error, {
        context: 'ai_request_failed',
        duration_ms: Date.now() - startTime
      });

      // If it's the last retry or a non-retriable error (unless it's network error which might be worth retrying)
      if (i === retries - 1 || (error.message.includes('AI Service Error') && !error.message.includes('429'))) {
        console.error("Gemini Network/API Error:", error)
        throw error
      }
    }
  }
}

export async function moderateContent(text) {
  const BAD_WORDS = ["spam", "scam", "fake", "badword", "misinformation", "hate", "abuse"]
  const lowerText = text.toLowerCase()
  const flagged = BAD_WORDS.some(word => lowerText.includes(word))

  if (!GEMINI_API_KEY) return { flagged, reason: flagged ? 'Contains inappropriate content' : null }

  try {
    const result = await callGemini(`Analyze this text for spam, toxicity, or inappropriate content. Reply with only "FLAGGED" or "SAFE":\n\n${text}`)

    // TELEMETRY: Security Signal (Critical for Challenge)
    if (result === 'FLAGGED') {
      datadogRum.addAction('ai_security_flagged', {
        reason: 'toxicity_detected',
        content_snippet: text.substring(0, 50)
      });
    }

    return { flagged: result === 'FLAGGED', reason: result === 'FLAGGED' ? 'AI detected inappropriate content' : null }
  } catch (err) {
    console.log('Gemini API unavailable, using fallback moderation')
    return { flagged, reason: flagged ? 'Contains inappropriate content' : null }
  }
}

export async function summarizePost(content) {
  if (!GEMINI_API_KEY || content.length < 200) return null
  try {
    return await callGemini(`Summarize this in one short sentence (max 15 words):\n\n${content}`)
  } catch (err) {
    return null
  }
}

export async function autoTagPost(title, content) {
  const text = `${title} ${content}`.toLowerCase()
  // Basic keyword fallback
  if (text.includes('note') || text.includes('study') || text.includes('exam')) return 'Notes'
  if (text.includes('doubt') || text.includes('help') || text.includes('question')) return 'Doubts'
  if (text.includes('job') || text.includes('internship') || text.includes('opportunity')) return 'Opportunities'
  if (text.includes('event') || text.includes('workshop') || text.includes('seminar')) return 'Events'

  if (!GEMINI_API_KEY) return 'General'

  try {
    const category = await callGemini(`Categorize this post into ONE of these: Notes, Doubts, Opportunities, Events, General. Reply with only the category name:\n\nTitle: ${title}\nContent: ${content}`)
    const validCategories = ['Notes', 'Doubts', 'Opportunities', 'Events', 'General']
    return validCategories.includes(category) ? category : 'General'
  } catch (err) {
    console.warn("AutoTag fallback:", err.message)
    return 'General'
  }
}

// New consolidated function to save API calls
export async function analyzePost(title, content) {
  if (!GEMINI_API_KEY) return { flagged: false, summary: null, category: 'General' };

  try {
    const prompt = `
        Analyze this post.
        1. Check for toxicity/spam (SAFE or FLAGGED).
        2. Summarize in max 10 words.
        3. Categorize into ONE of: Notes, Doubts, Opportunities, Events, General.

        Reply STRICTLY in this JSON format:
        {
          "flagged": true/false,
          "summary": "...",
          "category": "..."
        }

        Title: ${title}
        Content: ${content}
        `;

    const responseText = await callGemini(prompt);
    // Clean up markdown code blocks if present
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("Full analysis failed, falling back to basic checks", e);
    // Fallback
    return {
      flagged: false,
      summary: null,
      category: 'General'
    };
  }
}
