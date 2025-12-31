import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { supabase } from '../supabaseClient'

function Profile() {
  const { user, logout, uploadAvatar } = useContext(UserContext)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Profile Data State (Persisted in LocalStorage for Demo)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    bio: '',
    linkedin: '',
    github: '',
    customLink: ''
  })

  useEffect(() => {
    if (user) {
      fetchUserPosts()
      loadProfileData()
    }
  }, [user])

  const loadProfileData = () => {
    const saved = localStorage.getItem(`profile_data_${user.id}`)
    if (saved) {
      setProfileData(JSON.parse(saved))
    }
  }

  const saveProfileData = (e) => {
    e.preventDefault()
    localStorage.setItem(`profile_data_${user.id}`, JSON.stringify(profileData))
    setIsEditing(false)
    alert("Profile Updated! ✅")
  }

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author', user.username) // Assuming username is the author key
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserPosts(data || [])
    } catch (error) {
      console.error("Error fetching user posts:", error)
    } finally {
      setLoading(false)
    }
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
      alert('Avatar updated successfully!')
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
        <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', color: 'white' }}>
          <h2>Please login to view your profile</h2>
          <Link to="/" style={{ color: '#ffd700', textDecoration: 'underline' }}>Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '6rem', maxWidth: '1000px' }}>

        {/* Main Profile Card - Normalized */}
        <div style={{
          background: '#0a192f',
          borderRadius: '15px',
          border: '1px solid #334155',
          padding: '3rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          marginBottom: '3rem',
          display: 'flex',
          gap: '3rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>

          {/* Avatar Section */}
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
              <img
                src={user.avatar}
                alt={user.username}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #3b82f6' }}
              />
              <label style={{
                position: 'absolute', bottom: '5px', right: '5px',
                background: '#3b82f6', color: 'white',
                width: '35px', height: '35px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid #0a192f'
              }}>
                {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                <input type="file" accept="image/*" onChange={handleFileUpload} hidden disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Info Section */}
          <div style={{ flex: 1, color: '#e6f1ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{user.username}</h1>
                <p style={{ color: '#8892b0', marginTop: '0.5rem' }}>{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: 'transparent', border: '1px solid #64ffda',
                  color: '#64ffda', padding: '8px 20px', borderRadius: '5px',
                  cursor: 'pointer', fontSize: '0.9rem'
                }}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={saveProfileData} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  placeholder="Bio / Description"
                  value={profileData.bio}
                  onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#112240', color: 'white' }}
                />
                <input
                  placeholder="LinkedIn URL"
                  value={profileData.linkedin}
                  onChange={e => setProfileData({ ...profileData, linkedin: e.target.value })}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#112240', color: 'white' }}
                />
                <input
                  placeholder="GitHub URL"
                  value={profileData.github}
                  onChange={e => setProfileData({ ...profileData, github: e.target.value })}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#112240', color: 'white' }}
                />
                <input
                  placeholder="Other Link / Detail"
                  value={profileData.customLink}
                  onChange={e => setProfileData({ ...profileData, customLink: e.target.value })}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#112240', color: 'white' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                  {profileData.bio || "No description added yet."}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {profileData.linkedin && (
                    <a href={profileData.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64ffda', textDecoration: 'none' }}>
                      <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                  )}
                  {profileData.github && (
                    <a href={profileData.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64ffda', textDecoration: 'none' }}>
                      <i className="fab fa-github"></i> GitHub
                    </a>
                  )}
                  {profileData.customLink && (
                    <a href={profileData.customLink} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64ffda', textDecoration: 'none' }}>
                      <i className="fas fa-link"></i> Website
                    </a>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8892b0' }}>
                    <i className="fas fa-layer-group"></i> <strong>{userPosts.length}</strong> Posts
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              style={{
                marginTop: '2rem',
                background: '#ef4444', // Red Background
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#dc2626'} // Darker red on hover
              onMouseOut={(e) => e.target.style.background = '#ef4444'}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {/* User Posts Section */}
        <h2 style={{ fontSize: '2rem', color: '#ffd700', marginBottom: '2rem' }}>My Activity</h2>

        <div className="posts-grid home-page">
          {userPosts.map(post => {
            // Injection Fix copy from Home.js
            const [displayContent, embeddedImg] = (post.content || '').split('|||IMG|||');
            const finalImg = embeddedImg || post.image_url;

            return (
              <Link to={`/post/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                <div className="post-card" style={{
                  background: '#0a192f', border: '1px solid #ffd700',
                  borderRadius: '15px', padding: '2rem', marginBottom: '2rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#ffd700', fontSize: '0.9rem' }}>{post.category}</span>
                    <span style={{ color: '#8892b0', fontSize: '0.8rem' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ccd6f6' }}>{post.title}</h3>
                  <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: '1.6', color: '#8892b0' }}>
                    {displayContent ? displayContent.substring(0, 100) : ''}...
                  </p>
                  {finalImg && <div style={{ height: '150px', marginTop: '1rem', borderRadius: '10px', overflow: 'hidden' }}><img src={finalImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /></div>}
                </div>
              </Link>
            )
          })}

          {userPosts.length === 0 && (
            <p style={{ color: '#8892b0', fontSize: '1.2rem' }}>You haven't posted anything yet.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile
