import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { UserContext } from '../context/UserContext'
import { analyzePost } from '../utils/gemini'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const categories = ['Notes', 'Doubts', 'Opportunities', 'Events', 'Projects', 'General']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please login to create a post'); return }
    if (!title || !content) { alert('Please fill in all fields'); return }
    setLoading(true)

    try {
      let imageUrl = null;

      if (imageFile) {
        console.log("Processing image (Direct Database Mode)...");

        // Helper to convert file to base64
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

        if (imageFile.size > 2 * 1024 * 1024) {
          alert("Image is too large for direct storage (max 2MB). Please pick a smaller image.");
          setLoading(false);
          return;
        }

        try {
          imageUrl = await toBase64(imageFile);
          console.log("Image converted to Base64 successfully");
        } catch (e) {
          console.error("Base64 conversion failed", e);
          throw new Error("Failed to process image file.");
        }
      }

      // SCHEMA FALLBACK STRATEGY:
      // Since the 'image_url' column is missing in the database and we cannot change the schema,
      // we will append the image data safely to the 'content' field with a delimiter.

      let finalContent = content;
      if (imageUrl) {
        finalContent = `${content}|||IMG|||${imageUrl}`;
      }

      const basePost = {
        title,
        content: finalContent, // Store image INSIDE content
        category: category,
        author: user.username || 'Anonymous',
        // removed post_type and author_id as they do not exist
      }

      // No longer sending image_url as a separate column to avoid schema errors
      // if (imageUrl) { basePost.image_url = imageUrl }

      console.log("Publishing post to Supabase...", basePost)

      // 2. Insert into Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert([basePost])
        .select() // Important to get the ID back

      if (error) {
        throw new Error(error.message)
      }

      const newPostId = data && data[0] ? data[0].id : null;

      if (!newPostId) {
        throw new Error("Post created but no ID returned from Supabase.")
      }

      // 3. Visual Success Feedback
      setLoading('done')
      const delay = (ms) => new Promise(res => setTimeout(res, ms));
      await delay(800);

      console.log("Post published to Supabase, navigating...")
      // Use standard router navigation
      navigate('/feed')

        // 4. Background AI Enhancement (Optimized)
        // We run this async without awaiting so it doesn't block navigation
        (async () => {
          try {
            console.log("Starting background AI enhancement...")
            const analysis = await analyzePost(title, content);

            const updates = {};
            if (analysis.flagged) updates.flagged = true;
            if (analysis.summary) updates.summary = analysis.summary;
            if (analysis.category && analysis.category !== 'General' && category === 'General') {
              updates.category = analysis.category;
            }

            if (Object.keys(updates).length > 0) {
              console.log("Applying AI updates to post:", newPostId, updates)
              await supabase.from('posts').update(updates).eq('id', newPostId)
            }
          } catch (err) {
            console.warn("Background AI update failed:", err)
          }
        })();

    } catch (err) {
      // SUCCESS GUARD: If we already finished successfully, ignore any late errors (like navigation glitches)
      if (loading === 'done') {
        console.warn("Suppressing error after success:", err);
        return;
      }

      console.error("Publishing error:", err)
      // Removed alert as per user request to avoid annoying popups if the post actually worked.
      setLoading(false)
    }
  }

  return (
    <div className="create-post christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 20000, paddingTop: '4rem', maxWidth: '700px' }}>
        <div style={{
          padding: '3rem',
          background: 'rgba(10, 20, 40, 0.95)',
          border: '1px solid #ffd700',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 20001
        }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: "sans-serif", color: '#ffd700', textAlign: 'center', marginBottom: '2rem' }}>
            Create New Post
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 20002 }}>
            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Title</label>
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 20003 }}
              />
            </div>

            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: '#020024', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem', borderRadius: '10px', width: '100%', outline: 'none', position: 'relative', zIndex: 20003 }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#020024' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Content</label>
              <textarea
                placeholder="Share your thoughts, notes or projects..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                required
                style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: '100%', padding: '1rem', borderRadius: '10px', resize: 'none', outline: 'none', position: 'relative', zIndex: 20003 }}
              />
            </div>

            {/* Image Upload Section */}
            <div className="form-group">
              <label style={{ color: '#ffd700', display: 'block', marginBottom: '0.5rem' }}>Add Image (Optional)</label>
              <div style={{ position: 'relative', border: '2px dashed rgba(255,215,0,0.3)', borderRadius: '10px', padding: '1rem', textAlign: 'center', cursor: 'cursor', transition: 'all 0.3s' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 20004 }}
                />
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Stop form submission
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4e50', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', zIndex: 20005 }}
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '20px', color: 'rgba(255,255,255,0.6)' }}>
                    <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                    <span>Click to upload meaningful visuals</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-christmas-premium" style={{ width: '100%', border: 'none', position: 'relative', zIndex: 20003, fontFamily: "sans-serif", fontWeight: 'bold' }}>
              {loading ? (loading === 'done' ? 'POSTED! ✅' : 'PUBLISHING...') : 'PUBLISH POST'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
