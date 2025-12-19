import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="home-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem' }}>
        <h1 className="section-title">
          <i className="fas fa-gift"></i> Winter Feed <i className="fas fa-tree"></i>
        </h1>

        <div className="search-bar-container">
          <input
            type="text"
            className="festive-search"
            placeholder="Search festive posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="fas fa-search search-icon-overlay"></i>
        </div>

        <div className="categories-tray">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="posts-grid home-page">
          {filteredPosts.map(post => {
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
            const isLiked = user && likedPosts[`${user.username}_${post.id}`];

            return (
              <div key={post.id} className="post-card">
                <div className="post-header" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="category-badge"><i className="fas fa-tag"></i> {post.category}</span>
                  {post.flagged && <span className="flag-badge"><i className="fas fa-exclamation-triangle" style={{ color: '#ff4e50' }}></i></span>}
                </div>

                <div onClick={() => navigate(`/post/${post.id}`)} style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                  <h3 className="post-title" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{post.title}</h3>
                  <p className="post-excerpt" style={{ opacity: 0.8, fontSize: '1rem', lineHeight: '1.6' }}>{post.content.substring(0, 150)}...</p>
                </div>

                <div className="post-footer" style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem' }}>
                  <span className="author-tag" style={{ color: '#ffd700' }}><i className="fas fa-user-circle"></i> {post.author || 'Santa Helper'}</span>
                  <button
                    className="like-button"
                    onClick={(e) => { e.stopPropagation(); handleLike(post.id, post.likes, post.author) }}
                    style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    <i className={isLiked ? "fas fa-heart" : "far fa-heart"} style={{ color: isLiked ? '#ff4e50' : '#fff' }}></i>
                    <span style={{ marginLeft: '8px' }}>{post.likes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="empty-state-container" style={{ textAlign: 'center', padding: '4rem' }}>
            <p className="empty-text" style={{ fontSize: '1.5rem', color: '#ffd700' }}>
              <i className="fas fa-snowflake"></i> No snowflakes found here! Be the first to share warmth.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
