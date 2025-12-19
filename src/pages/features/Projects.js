import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('category', 'Projects').order('created_at', { ascending: false })
    if (!error) setProjects(data || [])
  }

  return (
    <div className="feature-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">
            <i className="fas fa-rocket"></i> Winter Workshop
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fff', opacity: 0.9 }}>Showcase your coding gifts to the campus community!</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <Link to="/" className="btn-new-project">
            <i className="fas fa-plus-circle"></i> START A NEW PROJECT
          </Link>
        </div>

        <div className="posts-grid home-page">
          {projects.map(project => (
            <Link to={`/post/${project.id}`} key={project.id} className="post-card" style={{ textDecoration: 'none', padding: '2.5rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--christmas-gold)', marginBottom: '1rem', fontWeight: 600 }}>
                <i className="fas fa-gift"></i> PROJECT GIFT
              </div>
              <h3 className="post-title" style={{ fontSize: '1.8rem', width: '100%', marginBottom: '1rem' }}>{project.title}</h3>
              <p className="post-excerpt" style={{ width: '100%', opacity: 0.8, marginBottom: '2rem' }}>{project.content.substring(0, 150)}...</p>
              <div className="post-footer" style={{ width: '100%', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="author-tag" style={{ color: '#ffd700' }}><i className="fas fa-user-circle"></i> {project.author}</span>
                <span style={{ fontWeight: 'bold', color: '#fff' }}><i className="fas fa-heart" style={{ color: 'var(--christmas-red)' }}></i> {project.likes || 0}</span>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="empty-state-container">
            <p className="empty-text">The workshop is empty! <i className="fas fa-snowflake"></i></p>
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>Be the first to share your project and light up the campus.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
