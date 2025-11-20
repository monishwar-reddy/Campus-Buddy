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
    
    if (!user) {
      alert('Please login to create a post')
      return
    }

    if (!title || !content) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      // AI Moderation
      const moderation = await moderateContent(`${title} ${content}`)
      
      // AI Summary (for long posts)
      const summary = content.length > 200 ? await summarizePost(content) : null
      
      // AI Auto-tag
      const suggestedCategory = await autoTagPost(title, content)

      const { error } = await supabase
        .from('posts')
        .insert([{
          title,
          content,
          category: category === 'General' ? suggestedCategory : category,
          author: user.username,
          flagged: moderation.flagged,
          summary,
          likes: 0
        }])

      if (error) {
        alert('Error creating post: ' + error.message)
      } else {
        if (moderation.flagged) {
          alert('⚠️ Post created but flagged for review')
        }
        navigate('/')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <textarea
          placeholder="Write your post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
