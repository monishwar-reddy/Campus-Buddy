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

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  return (
    <div className="feature-page christmas-feature">
      <div className="page-background" style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}></div>
      <div className="page-overlay"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '4rem' }}>
        <div className="feature-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: "'Mountains of Christmas', cursive", color: '#ffd700' }}>
            🏆 Winter Gift Board
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>See who's spreading the most festive cheer on campus!</p>
        </div>

        <div className="leaderboard-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ffd700' }}>Loading festive rankings... ❄️</div>
          ) : leaders.length === 0 ? (
            <div className="glass-card-3d" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No cheer spread yet. Be the first to post! 🎁</p>
            </div>
          ) : (
            <div className="glass-card-3d" style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)' }}>
              {/* Podium View */}
              {leaders.length >= 3 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {/* 2nd */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[1].author}`} alt="" style={{ width: '80px', borderRadius: '50%', border: '3px solid #c0c0c0', marginBottom: '1rem' }} />
                    <div style={{ fontSize: '1.5rem' }}>🥈</div>
                    <div style={{ fontWeight: 'bold' }}>{leaders[1].author}</div>
                    <div style={{ color: '#ffd700' }}>{leaders[1].totalLikes} ❤️</div>
                    <div style={{ width: '100px', height: '100px', background: 'rgba(192,192,192,0.2)', margin: '10px auto', borderRadius: '10px 10px 0 0' }}></div>
                  </div>
                  {/* 1st */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[0].author}`} alt="" style={{ width: '110px', borderRadius: '50%', border: '4px solid #ffd700', marginBottom: '1rem', boxShadow: '0 0 20px rgba(255,215,0,0.4)' }} />
                    <div style={{ fontSize: '2rem' }}>🥇</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{leaders[0].author}</div>
                    <div style={{ color: '#ffd700', fontWeight: 'bold' }}>{leaders[0].totalLikes} ❤️</div>
                    <div style={{ width: '120px', height: '140px', background: 'rgba(255,215,0,0.2)', margin: '10px auto', borderRadius: '10px 10px 0 0' }}></div>
                  </div>
                  {/* 3rd */}
                  <div style={{ textAlign: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[2].author}`} alt="" style={{ width: '80px', borderRadius: '50%', border: '3px solid #cd7f32', marginBottom: '1rem' }} />
                    <div style={{ fontSize: '1.5rem' }}>🥉</div>
                    <div style={{ fontWeight: 'bold' }}>{leaders[2].author}</div>
                    <div style={{ color: '#ffd700' }}>{leaders[2].totalLikes} ❤️</div>
                    <div style={{ width: '100px', height: '70px', background: 'rgba(205,127,50,0.2)', margin: '10px auto', borderRadius: '10px 10px 0 0' }}></div>
                  </div>
                </div>
              )}

              {/* Ranking List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leaders.map((leader, index) => (
                  <div key={leader.author} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '40px' }}>{getMedal(index)}</div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.author}`} alt="" style={{ width: '50px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{leader.author}</div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{leader.posts} posts published</div>
                    </div>
                    <div style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold' }}>
                      {leader.totalLikes} ❤️
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
