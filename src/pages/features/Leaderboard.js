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
      // Get all posts grouped by author with total likes
      const { data, error } = await supabase
        .from('posts')
        .select('author, likes')

      if (error) throw error

      // Calculate total likes per author
      const leaderMap = {}
      data.forEach(post => {
        if (post.author) {
          if (!leaderMap[post.author]) {
            leaderMap[post.author] = { author: post.author, totalLikes: 0, posts: 0 }
          }
          leaderMap[post.author].totalLikes += (post.likes || 0)
          leaderMap[post.author].posts += 1
        }
      })

      // Convert to array and sort
      const leaderArray = Object.values(leaderMap)
        .sort((a, b) => b.totalLikes - a.totalLikes)
        .slice(0, 10)

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
    <div className="feature-page">
      <div className="feature-header">
        <h1>🏆 Top Learners Leaderboard</h1>
        <p>Compete and become the Top Learner of the Week!</p>
      </div>

      <div className="leaderboard-container">
        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : leaders.length === 0 ? (
          <div className="empty-state">
            <p>No data yet. Start posting to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaders.length >= 3 && (
              <div className="podium">
                {/* 2nd Place */}
                <div className="podium-place second">
                  <div className="podium-avatar">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[1].author}`} alt="" />
                  </div>
                  <div className="podium-medal">🥈</div>
                  <div className="podium-name">{leaders[1].author}</div>
                  <div className="podium-score">❤️ {leaders[1].totalLikes}</div>
                  <div className="podium-bar" style={{height: '120px'}}></div>
                </div>

                {/* 1st Place */}
                <div className="podium-place first">
                  <div className="podium-avatar">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[0].author}`} alt="" />
                  </div>
                  <div className="podium-medal">🥇</div>
                  <div className="podium-name">{leaders[0].author}</div>
                  <div className="podium-score">❤️ {leaders[0].totalLikes}</div>
                  <div className="podium-bar" style={{height: '150px'}}></div>
                </div>

                {/* 3rd Place */}
                <div className="podium-place third">
                  <div className="podium-avatar">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[2].author}`} alt="" />
                  </div>
                  <div className="podium-medal">🥉</div>
                  <div className="podium-name">{leaders[2].author}</div>
                  <div className="podium-score">❤️ {leaders[2].totalLikes}</div>
                  <div className="podium-bar" style={{height: '90px'}}></div>
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="leaderboard-table">
              <h3>Full Rankings</h3>
              {leaders.map((leader, index) => (
                <div key={leader.author} className={`leader-row rank-${index + 1}`}>
                  <div className="leader-rank">{getMedal(index)}</div>
                  <div className="leader-avatar">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.author}`} alt="" />
                  </div>
                  <div className="leader-info">
                    <div className="leader-name">{leader.author}</div>
                    <div className="leader-stats">
                      {leader.posts} posts • {leader.totalLikes} likes
                    </div>
                  </div>
                  <div className="leader-score">
                    ❤️ {leader.totalLikes}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
