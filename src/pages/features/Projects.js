import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', 'Projects')
      .order('created_at', { ascending: false })

    if (!error) setProjects(data || [])
  }

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1>🚀 Mini Projects Section</h1>
        <p>Share your projects and get feedback from the community!</p>
      </div>

      <div className="projects-container">
        <Link to="/create" className="create-project-btn">
          + Create New Project
        </Link>

        <div className="projects-grid">
          {projects.map(project => (
            <Link to={`/post/${project.id}`} key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.content.substring(0, 150)}...</p>
              <div className="project-footer">
                <span>👤 {project.author}</span>
                <span>❤️ {project.likes || 0}</span>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
