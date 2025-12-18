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
    <div className="feature-page christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
            🚀 Winter Workshop
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>Showcase your coding gifts to the campus community!</p>
        </div>

        <div className="projects-section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link to="/create" className="btn-christmas-premium">
              + START A NEW PROJECT ✨
            </Link>
          </div>

          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {projects.map(project => (
              <Link to={`/post/${project.id}`} key={project.id} className="glass-card-3d" style={{ padding: '2rem', textDecoration: 'none', color: '#fff' }}>
                <div style={{ fontSize: '0.8rem', color: '#ffd700', marginBottom: '1rem', textTransform: 'uppercase' }}>Project Gift 🎁</div>
                <h3 style={{ fontSize: '1.8rem', color: '#ffd700', marginBottom: '1rem' }}>{project.title}</h3>
                <p style={{ opacity: 0.9, lineHeight: '1.6', marginBottom: '1.5rem' }}>{project.content.substring(0, 120)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.9rem' }}>👤 {project.author}</span>
                  <span style={{ fontWeight: 'bold', color: '#ffd700' }}>❤️ {project.likes || 0}</span>
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="glass-card-3d" style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '1.5rem', color: '#ffd700' }}>The workshop is empty! ❄️</p>
              <p>Be the first to share your project and light up the campus.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
