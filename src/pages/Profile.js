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
      <div className="profile-empty">
        <h2>Please login to view your profile</h2>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div style={{ position: 'relative' }}>
          <img src={user.avatar} alt={user.username} className="avatar" />
          <button 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#ff6b6b',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✏️
          </button>
        </div>
        <div>
          <h2>{user.username}</h2>
          <p>{userPosts.length} posts</p>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {showAvatarPicker && (
        <div className="avatar-picker">
          <h4>Choose Avatar Style:</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {avatarStyles.map(style => (
              <img
                key={style}
                src={`https://api.dicebear.com/7.x/${style}/svg?seed=${user.username}`}
                alt={style}
                onClick={() => changeAvatar(style)}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: '2px solid #ff6b6b',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>
      )}

      <div className="user-posts">
        <h3>Your Posts</h3>
        {userPosts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="user-post-card">
            <div className="post-header">
              <span className="category-badge">{post.category}</span>
              {post.flagged && <span className="flag-badge">⚠️</span>}
            </div>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <div className="post-stats">
              <span>❤️ {post.likes || 0}</span>
              <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}

        {userPosts.length === 0 && (
          <p className="no-posts">You haven't created any posts yet.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
