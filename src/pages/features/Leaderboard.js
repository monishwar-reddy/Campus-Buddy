import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.from('posts').select('author, likes')
      if (error) throw error
      const leaderMap = {}
      data.forEach(post => {
        if (post.author) {
          if (!leaderMap[post.author]) { leaderMap[post.author] = { author: post.author, totalLikes: 0, posts: 0 } }
          leaderMap[post.author].totalLikes += (post.likes || 0)
          leaderMap[post.author].posts += 1
        }
      })
      const leaderArray = Object.values(leaderMap).sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 10)
      setLeaders(leaderArray)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index) => {
    if (index === 0) return <i className="fas fa-crown" style={{ color: '#ffd700' }}></i>
    if (index === 1) return <i className="fas fa-medal" style={{ color: '#c0c0c0' }}></i>
    if (index === 2) return <i className="fas fa-medal" style={{ color: '#cd7f32' }}></i>
    return <span style={{ opacity: 0.6 }}>{index + 1}</span>
  }

  return (
    <div className="feature-page">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem', maxWidth: '1000px' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">
            <i className="fas fa-trophy"></i> Winter Gift Board
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#fff', opacity: 0.9 }}>
            See who's spreading the most festive cheer on campus!
          </p>
        </div>

        <div className="leaderboard-container">
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ffd700' }}>
              <i className="fas fa-snowflake fa-spin"></i> Loading festive rankings...
            </div>
          ) : leaders.length === 0 ? (
            <div className="post-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p className="empty-text">No cheer spread yet. Be the first to post! <i className="fas fa-gift"></i></p>
            </div>
          ) : (
            <div className="post-card" style={{ padding: '3rem', alignItems: 'stretch' }}>
              {/* Podium View */}
              {leaders.length >= 3 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '3rem', marginBottom: '5rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {/* 2nd */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[1].author}`} alt="" style={{ width: '80px', borderRadius: '50%', border: '4px solid #c0c0c0', marginBottom: '1.5rem' }} />
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}><i className="fas fa-medal" style={{ color: '#c0c0c0' }}></i></div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{leaders[1].author}</div>
                    <div style={{ color: '#ffd700' }}>{leaders[1].totalLikes} <i className="fas fa-heart"></i></div>
                  </div>
                  {/* 1st */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[0].author}`} alt="" style={{ width: '120px', borderRadius: '50%', border: '5px solid #ffd700', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(255,215,0,0.3)' }} />
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}><i className="fas fa-crown" style={{ color: '#ffd700' }}></i></div>
                    <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#ffd700' }}>{leaders[0].author}</div>
                    <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>{leaders[0].totalLikes} <i className="fas fa-heart"></i></div>
                  </div>
                  {/* 3rd */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[2].author}`} alt="" style={{ width: '80px', borderRadius: '50%', border: '4px solid #cd7f32', marginBottom: '1.5rem' }} />
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}><i className="fas fa-medal" style={{ color: '#cd7f32' }}></i></div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{leaders[2].author}</div>
                    <div style={{ color: '#ffd700' }}>{leaders[2].totalLikes} <i className="fas fa-heart"></i></div>
                  </div>
                </div>
              )}

              {/* Ranking List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {leaders.map((leader, index) => (
                  <div key={leader.author} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.2rem 2.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, width: '40px', textAlign: 'center' }}>{getRankIcon(index)}</div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.author}`} alt="" style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{leader.author}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.6 }}><i className="fas fa-scroll"></i> {leader.posts} posts published</div>
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#ffd700', fontWeight: 900 }}>
                      {leader.totalLikes} <i className="fas fa-heart" style={{ color: 'var(--christmas-red)' }}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
