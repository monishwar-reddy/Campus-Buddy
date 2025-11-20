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
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (!error) setPost(data)
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (!error) setComments(data || [])
  }

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    if (user.username === post.author) {
      alert("You can't like your own post!")
      return
    }

    // Check if user already liked this post (stored in localStorage)
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    const likeKey = `${user.username}_${id}`
    
    let newLikes = post.likes || 0
    
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
      .eq('id', id)

    if (!error) fetchPost()
  }

  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please login to comment')
      return
    }

    if (!newComment.trim()) return

    const { error } = await supabase
      .from('comments')
      .insert([{
        post_id: id,
        author: user.username,
        content: newComment
      }])

    if (!error) {
      setNewComment('')
      fetchComments()
    }
  }

  const handleDelete = async () => {
    if (!user || user.username !== post.author) {
      alert('You can only delete your own posts')
      return
    }

    if (window.confirm('Delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (!error) navigate('/')
    }
  }

  if (!post) return <div className="loading">Loading...</div>

  return (
    <div className="post-detail">
      <div className={`post-content ${post.flagged ? 'flagged' : ''}`}>
        <div className="post-header">
          <span className="category-badge">{post.category}</span>
          {post.flagged && <span className="flag-badge">⚠️ Flagged Content</span>}
        </div>

        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>👤 {post.author || 'Anonymous'}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {post.summary && (
          <div className="ai-summary">
            <strong>AI Summary:</strong> {post.summary}
          </div>
        )}

        <p className="post-body">{post.content}</p>

        <div className="post-actions">
          <button 
            className="like-btn" 
            onClick={handleLike}
            disabled={user && user.username === post.author}
            style={{ 
              opacity: user && user.username === post.author ? 0.5 : 1, 
              cursor: user && user.username === post.author ? 'not-allowed' : 'pointer',
              background: user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${id}`] ? '#ff6b6b' : 'transparent'
            }}
          >
            {user && JSON.parse(localStorage.getItem('likedPosts') || '{}')[`${user.username}_${id}`] ? '❤️' : '🤍'} {post.likes || 0} Likes
          </button>
          {user && user.username === post.author && (
            <button className="delete-btn" onClick={handleDelete}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>💬 Comments ({comments.length})</h3>

        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
            />
            <button type="submit">Post Comment</button>
          </form>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>👤 {comment.author}</strong>
              <p>{comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  )
}

export default PostDetail
