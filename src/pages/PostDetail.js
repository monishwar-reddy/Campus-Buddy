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
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (!error) setPost(data)
  }

  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true })
    if (!error) setComments(data || [])
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
    const { error } = await supabase.from('posts').update({ likes: newLikes }).eq('id', id)
    if (!error) fetchPost()
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please login to comment'); return }
    if (!newComment.trim()) return
    const { error } = await supabase.from('comments').insert([{ post_id: id, author: user.username, content: newComment }])
    if (!error) { setNewComment(''); fetchComments() }
  }

  const handleDelete = async () => {
    if (!user || user.username !== post.author) { alert('You can only delete your own posts'); return }
    if (window.confirm('Delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (!error) navigate('/')
    }
  }

  if (!post) return <div className="loading" style={{ textAlign: 'center', paddingTop: '100px', color: '#ffd700', fontSize: '2rem' }}>Loading Magic... ❄️</div>

  const isLiked = user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${id}`]

  return (
    <div className="post-detail christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', maxWidth: '800px' }}>
        <div className="glass-card-3d" style={{ padding: '3rem', background: 'rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ padding: '5px 15px', background: 'rgba(255,215,0,0.2)', color: '#ffd700', borderRadius: '50px', fontSize: '0.9rem' }}>{post.category}</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>📅 {new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700', marginBottom: '1.5rem' }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="" style={{ width: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontWeight: 'bold' }}>Gifted by: {post.author}</span>
          </div>

          {post.summary && (
            <div style={{ background: 'rgba(212, 20, 90, 0.1)', borderLeft: '4px solid #d4145a', padding: '1.5rem', marginBottom: '2rem', borderRadius: '10px' }}>
              <strong style={{ color: '#d4145a', display: 'block', marginBottom: '0.5rem' }}>❄️ Winter AI Summary:</strong>
              <p style={{ margin: 0, opacity: 0.9, fontStyle: 'italic' }}>{post.summary}</p>
            </div>
          )}

          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>

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

        <div className="glass-card-3d" style={{ padding: '2.5rem', background: 'rgba(46, 139, 87, 0.05)' }}>
          <h3 style={{ fontSize: '2rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700', marginBottom: '2rem' }}>💬 Holiday Cheer ({comments.length})</h3>

          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: '3rem' }}>
              <textarea
                placeholder="Write a festive comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '1rem', borderRadius: '15px', resize: 'none', outline: 'none', marginBottom: '1rem' }}
              />
              <button type="submit" className="btn-christmas-premium" style={{ width: '100%', fontSize: '1rem' }}>POST COMMENT ❄️</button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#ffd700', marginBottom: '0.4rem' }}>{comment.author}</div>
                  <p style={{ margin: 0, opacity: 0.9 }}>{comment.content}</p>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.8rem' }}>{new Date(comment.created_at).toLocaleString()}</div>
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
