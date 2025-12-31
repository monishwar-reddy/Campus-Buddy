import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { UserContext } from '../context/UserContext'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.log("No such document or error:", error)
      } else {
        setPost(data)
      }
    } catch (e) {
      console.error("Error getting document:", e)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (e) {
      console.error("Error fetching comments:", e)
    }
  }

  const handleLike = async () => {
    if (!user) { alert('Please login to like posts'); return }
    if (user.username === post.author) { alert("You can't like your own post!"); return }
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    const likeKey = `${user.username}_${id}`
    let newLikes = post.likes || 0
    if (likedPosts[likeKey]) {
      newLikes = Math.max(0, newLikes - 1)
      delete likedPosts[likeKey]
    } else {
      newLikes = newLikes + 1
      likedPosts[likeKey] = true
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))

    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', id)

      if (error) throw error
      setPost(prev => ({ ...prev, likes: newLikes }))
    } catch (e) {
      console.error("Error liking post:", e)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please login to comment'); return }
    if (!newComment.trim()) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: id,
          author: user.username,
          content: newComment
          // created_at handled by default
        }])

      if (error) throw error
      setNewComment('')
      fetchComments()
    } catch (e) {
      console.error("Error adding comment:", e)
    }
  }

  const handleDelete = async () => {
    if (!user || user.username !== post.author) { alert('You can only delete your own posts'); return }
    if (window.confirm('Delete this post?')) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', id)
        if (error) throw error
        navigate('/')
      } catch (e) {
        console.error("Error deleting post:", e)
      }
    }
  }

  if (!post) return <div className="loading" style={{ textAlign: 'center', paddingTop: '100px', color: '#ffd700', fontSize: '2rem' }}>Loading Magic... ❄️</div>

  const isLiked = user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${id}`]

  return (
    <div className="post-detail christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', maxWidth: '800px' }}>
        {/* Simplified "Normal" Card Style */}
        <div style={{
          padding: '3rem',
          background: '#0a192f', // Solid dark background
          border: '1px solid #ffd700',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ padding: '5px 15px', background: 'rgba(255,215,0,0.1)', color: '#ffd700', borderRadius: '50px', fontSize: '0.9rem', border: '1px solid #ffd700' }}>{post.category}</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.7, color: '#ccd6f6' }}>📅 {post.created_at ? new Date(post.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontFamily: "sans-serif", fontWeight: 'bold', color: '#e6f1ff', marginBottom: '1.5rem' }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="" style={{ width: '40px', borderRadius: '50%', background: '#112240' }} />
            <span style={{ fontWeight: 'bold', color: '#8892b0' }}>Author: {post.author}</span>
          </div>

          {post.summary && (
            <div style={{ background: 'rgba(100, 255, 218, 0.1)', borderLeft: '4px solid #64ffda', padding: '1.5rem', marginBottom: '2rem', borderRadius: '4px' }}>
              <strong style={{ color: '#64ffda', display: 'block', marginBottom: '0.5rem' }}>AI Summary:</strong>
              <p style={{ margin: 0, opacity: 0.9, fontStyle: 'italic', color: '#e6f1ff' }}>{post.summary}</p>
            </div>
          )}

          {/* Logic to handle Content Injection (Schema Bypass) */}
          {(() => {
            const [displayContent, embeddedImg] = (post.content || '').split('|||IMG|||');
            const finalImg = embeddedImg || post.image_url;

            return (
              <>
                <div style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
                  {displayContent}
                </div>

                {finalImg && (
                  <div style={{ marginBottom: '3rem', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img
                      src={finalImg}
                      alt={post.title}
                      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </>
            );
          })()}

          <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <button
              onClick={handleLike}
              style={{ padding: '0.8rem 2rem', borderRadius: '50px', border: '1px solid #ffd700', cursor: 'pointer', background: isLiked ? '#ffd700' : 'transparent', color: isLiked ? '#020024' : '#ffd700', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
            >
              {isLiked ? '❤️' : '🤍'} {post.likes || 0} Appreciations
            </button>

            {user && user.username === post.author && (
              <button onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: '#ff4e50', cursor: 'pointer', textDecoration: 'underline' }}>
                Discard Gift 🗑️
              </button>
            )}
          </div>
        </div>

        <div style={{
          padding: '2.5rem',
          background: '#1e293b', // Standard Slate Grey (Dark Mode)
          border: '1px solid #334155',
          borderRadius: '12px',
          marginTop: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: "sans-serif", fontWeight: '600', color: '#f8fafc', marginBottom: '1.5rem' }}>Comments ({comments.length})</h3>

          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  background: '#ffffff', // Standard White Input
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '1rem',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  padding: '0.75rem',
                  background: '#3b82f6', // Standard Blue Button
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Post Comment
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#ffd700', marginBottom: '0.4rem' }}>{comment.author}</div>
                  <p style={{ margin: 0, opacity: 0.9 }}>{comment.content}</p>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.8rem' }}>{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>No holiday cheer yet. Be the first! 🎄</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
