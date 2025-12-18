import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { UserContext } from '../context/UserContext'

function Home() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

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
    if (!user) { alert('Please login to like posts'); return }
    if (user.username === postAuthor) { alert("You can't like your own post!"); return }
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    const likeKey = `${user.username}_${postId}`
    let newLikes = currentLikes || 0
    if (likedPosts[likeKey]) {
      newLikes = Math.max(0, newLikes - 1)
      delete likedPosts[likeKey]
    } else {
      newLikes = newLikes + 1
      likedPosts[likeKey] = true
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    const { error } = await supabase.from('posts').update({ likes: newLikes }).eq('id', postId)
    if (!error) fetchPosts()
  }

  return (
    <div className="home christmas-home">
      {/* 1. Page Background & Overlay - Using Public Image */}
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '2rem' }}>
        <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '4rem', textAlign: 'center', marginBottom: '2rem', color: '#ffd700' }}>
          🎁 Winter Feed 🎄
        </h1>

        <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search festive posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
          />
        </div>

        <div className="categories" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={category === cat ? 'active cat-btn' : 'cat-btn'}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'linear-gradient(135deg, #d4145a 0%, #ff0055 100%)' : 'rgba(255,255,255,0.05)',
                color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredPosts.map(post => (
            <div key={post.id} className="glass-card-3d post-card" style={{ padding: '2rem', position: 'relative' }}>
              <div className="post-header" style={{ marginBottom: '1rem' }}>
                <span className="category-badge" style={{ background: '#2e8b57', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem' }}>{post.category}</span>
                {post.flagged && <span className="flag-badge" style={{ marginLeft: '1rem' }}>⚠️</span>}
              </div>

              <div onClick={() => navigate(`/post/${post.id}`)} style={{ cursor: 'pointer' }}>
                <h3 style={{ fontSize: '1.8rem', color: '#ffd700', marginBottom: '1rem' }}>{post.title}</h3>
                <p style={{ opacity: 0.9, lineHeight: '1.6' }}>{post.content.substring(0, 150)}...</p>
              </div>

              <div className="post-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <span className="author" style={{ fontSize: '0.9rem', color: '#ffd700' }}>👤 {post.author || 'Santa Helper'}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id, post.likes, post.author) }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}
                >
                  {user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${post.id}`] ? '❤️' : '🤍'} {post.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ fontSize: '1.5rem', color: '#ffd700' }}>No snowflakes found here! ❄️ Be the first to share warmth.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
