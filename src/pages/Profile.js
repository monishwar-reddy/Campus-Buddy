import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { supabase } from '../supabaseClient'

function Profile() {
  const { user, logout, uploadAvatar } = useContext(UserContext)
  const [userPosts, setUserPosts] = useState([])
  const [uploading, setUploading] = useState(false)

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

  const handleFileUpload = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      const { error } = await uploadAvatar(file)
      if (error) throw error
      alert('Avatar updated successfully! ❄️')
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
        <div className="page-overlay"></div>
        <div className="container relative-z flex-center" style={{ minHeight: '80vh' }}>
          <div className="post-card" style={{ maxWidth: '500px', alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Join the Festive Cheer! <i className="fas fa-santa"></i></h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem' }}>Please login to view your winter profile.</p>
            <Link to="/" className="btn-christmas-premium">Back to Magic</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '6rem' }}>
        <div className="profile-hero-card">
          <div className="avatar-container" style={{ position: 'relative' }}>
            <img
              src={user.avatar}
              alt={user.username}
              className="profile-avatar-img"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-label" style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'var(--christmas-red)',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              color: 'white'
            }}>
              {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                hidden
              />
            </label>
          </div>

          <div className="profile-info" style={{ flex: 1 }}>
            <h2 className="profile-name" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--christmas-gold)' }}>{user.username}</h2>
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <p style={{ color: '#e0f7fa', fontSize: '1.3rem', fontWeight: 500 }}>
                <i className="fas fa-snowflake" style={{ color: 'var(--christmas-gold)' }}></i> Winter Explorer
              </p>
              <p style={{ color: '#e0f7fa', fontSize: '1.3rem', fontWeight: 500 }}>
                <i className="fas fa-layer-group" style={{ color: 'var(--christmas-gold)' }}></i> {userPosts.length} posts published
              </p>
            </div>

            <button onClick={logout} className="logout-btn-large">
              <i className="fas fa-power-off"></i> Logout From Campus
            </button>
          </div>
        </div>

        <div className="user-posts-section" style={{ marginTop: '6rem' }}>
          <h3 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '4rem', textAlign: 'left' }}>
            <i className="fas fa-book-open"></i> Your Christmas Chronicles
          </h3>

          <div className="posts-grid home-page">
            {userPosts.map(post => (
              <Link to={`/post/${post.id}`} key={post.id} className="post-card" style={{ textDecoration: 'none', padding: '2.5rem' }}>
                <div className="post-header" style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <span className="category-badge"><i className="fas fa-tag"></i> {post.category}</span>
                  {post.flagged && <span className="flag-badge"><i className="fas fa-flag"></i></span>}
                </div>
                <h4 className="post-title" style={{ width: '100%', fontSize: '1.8rem' }}>{post.title}</h4>
                <p className="post-excerpt" style={{ width: '100%', opacity: 0.8, marginBottom: '2rem' }}>{post.content.substring(0, 100)}...</p>
                <div className="post-footer" style={{ width: '100%', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="author-tag" style={{ color: 'var(--christmas-gold)' }}><i className="fas fa-heart"></i> {post.likes || 0}</span>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}><i className="fas fa-calendar-alt"></i> {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {userPosts.length === 0 && (
            <div className="empty-state-container" style={{ padding: '5rem', background: 'rgba(255,255,255,0.03)' }}>
              <p className="empty-text" style={{ fontSize: '1.8rem' }}>You haven't shared any magic yet! <i className="fas fa-snowflake"></i></p>
              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/" className="btn-christmas-premium" style={{ width: 'auto', display: 'inline-block' }}>
                  Create Your First Post <i className="fas fa-magic"></i>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
