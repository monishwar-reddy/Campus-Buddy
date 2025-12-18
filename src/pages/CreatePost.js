import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { UserContext } from '../context/UserContext'
import { moderateContent, summarizePost, autoTagPost } from '../utils/gemini'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const categories = ['Notes', 'Doubts', 'Opportunities', 'Events', 'Projects', 'General']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please login to create a post'); return }
    if (!title || !content) { alert('Please fill in all fields'); return }
    setLoading(true)

    try {
      const moderation = await moderateContent(`${title} ${content}`)
      const summary = content.length > 200 ? await summarizePost(content) : null
      const suggestedCategory = await autoTagPost(title, content)

      const { error } = await supabase.from('posts').insert([{
        title, content, category: category === 'General' ? suggestedCategory : category,
        author: user.username, flagged: moderation.flagged, summary, likes: 0
      }])

      if (error) alert('Error creating post: ' + error.message)
      else {
        if (moderation.flagged) alert('⚠️ Post created but flagged for review')
        navigate('/feed')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', maxWidth: '700px' }}>
        <div className="glass-card-3d" style={{ padding: '3rem', background: 'rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700', textAlign: 'center', marginBottom: '2rem' }}>
            🎁 Share a Winter Gift
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Title</label>
              <input
                type="text"
                placeholder="Title of your post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem', borderRadius: '10px', width: '100%', outline: 'none' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#020024' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Content</label>
              <textarea
                placeholder="Share your thoughts, notes or projects..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                required
                style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: '100%', padding: '1rem', borderRadius: '10px', resize: 'none', outline: 'none' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-christmas-premium" style={{ width: '100%', border: 'none' }}>
              {loading ? 'Processing Magic...' : 'PUBLISH GIFT ✨'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
