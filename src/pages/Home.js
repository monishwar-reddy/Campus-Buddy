import { useState, useEffect, useContext } from 'react'
import { supabase } from '../supabaseClient'
import { UserContext } from '../context/UserContext'

function Home() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const { user } = useContext(UserContext)

  const categories = ['All', 'Notes', 'Doubts', 'Opportunities', 'Events', 'Projects', 'General']

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
    
    if (category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (!error) setPosts(data)
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  )

  const handleLike = async (postId, currentLikes, postAuthor) => {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    if (user.username === postAuthor) {
      alert("You can't like your own post!")
      return
    }

    // Check if user already liked this post (stored in localStorage)
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    const likeKey = `${user.username}_${postId}`
    
    let newLikes = currentLikes || 0
    
    if (likedPosts[likeKey]) {
      // Unlike - decrease count
      newLikes = Math.max(0, newLikes - 1)
      delete likedPosts[likeKey]
    } else {
      // Like - increase count
      newLikes = newLikes + 1
      likedPosts[likeKey] = true
    }
    
    // Save to localStorage
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    
    // Update in database
    const { error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', postId)

    if (!error) fetchPosts()
  }

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="posts-grid">
        {filteredPosts.map(post => (
          <div key={post.id} className={`post-card ${post.flagged ? 'flagged' : ''}`}>
            <div className="post-header">
              <span className="category-badge">{post.category}</span>
              {post.flagged && <span className="flag-badge">⚠️ Flagged</span>}
            </div>
            
            <div onClick={() => window.location.href = `/post/${post.id}`} style={{ cursor: 'pointer' }}>
              <h3>{post.title}</h3>
              <p className="post-preview">{post.content.substring(0, 150)}...</p>
              {post.summary && <p className="ai-summary">📝 {post.summary}</p>}
            </div>

            <div className="post-footer">
              <span className="author">👤 {post.author || 'Anonymous'}</span>
              <button 
                className="like-btn" 
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike(post.id, post.likes, post.author)
                }}
                disabled={user && user.username === post.author}
                style={{ 
                  opacity: user && user.username === post.author ? 0.5 : 1,
                  background: user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${post.id}`] ? '#ff6b6b' : 'transparent'
                }}
              >
                {user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${post.id}`] ? '❤️' : '🤍'} {post.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="empty-state">
          <p>No posts found. Be the first to post!</p>
        </div>
      )}
    </div>
  )
}

export default Home
