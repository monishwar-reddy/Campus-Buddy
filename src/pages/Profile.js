import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { supabase } from '../supabaseClient'

function Profile() {
  const { user, logout, login } = useContext(UserContext)
  const [userPosts, setUserPosts] = useState([])
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const avatarStyles = ['avataaars', 'bottts', 'personas', 'lorelei', 'micah', 'adventurer']

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchUserPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author', user.username)
      .order('created_at', { ascending: false })

    if (!error) setUserPosts(data || [])
  }

  const changeAvatar = (style) => {
    const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${user.username}`
    const userData = { ...user, avatar: newAvatar }
    login(user.username, newAvatar)
    setShowAvatarPicker(false)
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="winter-3d-bg"></div>
        <div className="glass-card" style={{ maxWidth: '400px', margin: '10rem auto', textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '2.5rem' }}>Join the Festive Cheer! 🎅</h2>
          <p style={{ margin: '1rem 0' }}>Please login to view your winter profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* 3D Winter Theme Background (CSS Gradient + Global Snowfall) */}
      <div className="winter-3d-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)', opacity: 0.3, zIndex: -1 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user.avatar}
              alt={user.username}
              className="avatar"
              style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #d4145a', boxShadow: '0 0 25px rgba(212, 20, 90, 0.6)' }}
            />
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: '#ffd700',
                border: '2px solid #fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                color: '#d4145a'
              }}
              title="Edit Avatar"
            >
              ✎
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
              {user.username}
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, color: '#e0f7fa' }}>❄️ Winter Explorer</p>
            <p style={{ marginTop: '1rem' }}>📜 {userPosts.length} posts published</p>
          </div>

          <button onClick={logout} className="btn-secondary" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
            Logout
          </button>
        </div>

        {showAvatarPicker && (
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', animation: 'slideUp 0.3s' }}>
            <h4 style={{ marginBottom: '1rem', color: '#ffd700' }}>Choose Your Winter Avatar Style:</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {avatarStyles.map(style => (
                <img
                  key={style}
                  src={`https://api.dicebear.com/7.x/${style}/svg?seed=${user.username}`}
                  alt={style}
                  onClick={() => changeAvatar(style)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: '3px solid transparent',
                    transition: 'all 0.3s',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)'
                    e.target.style.borderColor = '#ffd700'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.borderColor = 'transparent'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="user-posts-section">
          <h3 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', fontFamily: "'Mountains of Christmas', cursive", color: '#fff' }}>
            Your Christmas Chronicles 📖
          </h3>

          <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {userPosts.map(post => (
              <Link to={`/post/${post.id}`} key={post.id} className="glass-card" style={{ padding: '2rem', textDecoration: 'none', color: '#fff' }}>
                <div className="post-header" style={{ marginBottom: '1rem' }}>
                  <span className="category-badge" style={{ background: 'rgba(212, 20, 90, 0.3)', color: '#ffd700', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem' }}>{post.category}</span>
                  {post.flagged && <span className="flag-badge">⚠️</span>}
                </div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffd700' }}>{post.title}</h4>
                <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{post.content.substring(0, 100)}...</p>
                <div className="post-stats" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                  <span>❤️ {post.likes || 0}</span>
                  <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {userPosts.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="no-posts" style={{ fontSize: '1.5rem' }}>You haven't created any posts yet.</p>
              <Link to="/" className="btn-christmas-premium" style={{ marginTop: '2rem', display: 'inline-block' }}>Create Your First Post ✨</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
