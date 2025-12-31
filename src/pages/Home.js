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
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      alert("Failed to fetch posts. Please check your internet connection.")
    }
  }

  const filteredPosts = posts.filter(p => {
    const title = p.title ? p.title.toLowerCase() : '';
    const content = p.content ? p.content.toLowerCase() : '';
    const searchLower = search.toLowerCase();

    const matchesSearch = title.includes(searchLower) || content.includes(searchLower);
    const matchesCategory = category === 'All' || p.category === category;

    return matchesSearch && matchesCategory;
  })

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

    // Supabase update
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', postId)

      if (error) throw error

      // Optimistic update
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: newLikes } : p))
    } catch (e) {
      console.error("Error updating likes:", e)
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to remove this post?')) return
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (e) {
      console.error("Error deleting post:", e)
      alert("Failed to delete post")
    }
  }


  return (
    <div className="home-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem' }}>


        <h1 className="section-title">
          <i className="fas fa-gift"></i> Winter Feed <i className="fas fa-tree"></i>
        </h1>


        {/* Create Post Button */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/create')}
            className="btn-christmas-premium"
            style={{
              background: 'linear-gradient(45deg, #00c851, #007e33)',
              padding: '12px 30px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(0, 200, 81, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <i className="fas fa-plus-circle"></i> Share Your Warmth
          </button>
        </div>

        <div className="search-bar-container" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            className="festive-search"
            placeholder="Search festive posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 3rem 1rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              color: '#fff',
              fontSize: '1.1rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
              e.target.style.borderColor = '#ffd700';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', right: '1.5rem', color: '#ffd700', fontSize: '1.2rem', pointerEvents: 'none' }}></i>
        </div>

        <div className="categories-tray" style={{ gap: '10px', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'linear-gradient(45deg, #ffd700, #ff8c00)' : 'rgba(255,255,255,0.1)',
                color: category === cat ? '#000' : '#fff',
                border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(5px)',
                padding: '8px 20px',
                borderRadius: '25px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: category === cat ? '0 0 15px rgba(255, 215, 0, 0.4)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="posts-grid home-page">
          {filteredPosts.map(post => {
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
            const isLiked = user && likedPosts[`${user.username}_${post.id}`];

            // Fix for Content Injection: separate text from hidden image data
            const [displayContent, embeddedImg] = (post.content || '').split('|||IMG|||');
            const finalImg = embeddedImg || post.image_url;

            return (
              <div
                key={post.id}
                className="post-card"
                style={{
                  background: '#0a192f', // Solid dark blue
                  border: '1px solid #ffd700', // Gold border
                  borderRadius: '15px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s ease', // subtle hover only
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="post-header" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="category-badge" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid #ffd700', padding: '4px 12px', borderRadius: '20px' }}>
                    <i className="fas fa-tag"></i> {post.category}
                  </span>
                  {post.flagged && <span className="flag-badge"><i className="fas fa-exclamation-triangle" style={{ color: '#ff4e50' }}></i></span>}
                </div>

                <div onClick={() => navigate(`/post/${post.id}`)} style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                  <h3 className="post-title" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{post.title}</h3>
                  <p className="post-excerpt" style={{ opacity: 0.8, fontSize: '1rem', lineHeight: '1.6' }}>
                    {displayContent ? displayContent.substring(0, 150) : ''}...
                  </p>

                  {finalImg && (
                    <div style={{ marginTop: '1rem', borderRadius: '10px', overflow: 'hidden', height: '200px', width: '100%' }}>
                      <img
                        src={finalImg}
                        alt="Post attachment"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                <div className="post-footer" style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem' }}>
                  <span className="author-tag" style={{ color: '#ffd700' }}><i className="fas fa-user-circle"></i> {post.author || 'Santa Helper'}</span>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      className="like-button"
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id, post.likes, post.author) }}
                      style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      <i className={isLiked ? "fas fa-heart" : "far fa-heart"} style={{ color: isLiked ? '#ff4e50' : '#fff' }}></i>
                      <span style={{ marginLeft: '8px' }}>{post.likes || 0}</span>
                    </button>

                    {user && user.username === post.author && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(post.id) }}
                        style={{ background: 'transparent', border: 'none', color: '#ff4e50', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.8, transition: 'opacity 0.2s' }}
                        title="Delete Post"
                        onMouseOver={(e) => e.target.style.opacity = '1'}
                        onMouseOut={(e) => e.target.style.opacity = '0.8'}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
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
