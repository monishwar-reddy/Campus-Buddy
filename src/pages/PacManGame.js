import { useState, useEffect, useCallback, useRef } from 'react'

function PacManGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [pacman, setPacman] = useState({ x: 1, y: 1 })
  const directionRef = useRef('right')
  const [dots, setDots] = useState([])
  const [ghosts, setGhosts] = useState([
    { x: 13, y: 1, color: '#ff0000', dir: 'left' },
    { x: 1, y: 13, color: '#00ffff', dir: 'right' },
    { x: 13, y: 13, color: '#ffb8ff', dir: 'up' },
    { x: 6, y: 3, color: '#ffb852', dir: 'down' }
  ])

  const gridSize = 15
  const cellSize = 30

  const walls = [
    { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
    { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 },
    { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 },
    { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 },
    { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 },
    { x: 7, y: 6 }, { x: 7, y: 8 },
    { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 },
    { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 },
    { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 },
    { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
    { x: 3, y: 12 }, { x: 4, y: 12 }, { x: 10, y: 12 }, { x: 11, y: 12 }
  ]

  const isWall = useCallback((x, y) => {
    return walls.some(w => w.x === x && w.y === y)
  }, [])

  useEffect(() => {
    const initialDots = []
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const isStartPosition = (x === 1 && y === 1) || (x === 13 && y === 1) || (x === 1 && y === 13) || (x === 13 && y === 13) || (x === 6 && y === 3)
        if (!isStartPosition && !isWall(x, y)) {
          initialDots.push({ x, y })
        }
      }
    }
    setDots(initialDots)
  }, [isWall])

  const movePacman = useCallback(() => {
    setPacman(prev => {
      let newX = prev.x
      let newY = prev.y
      switch (directionRef.current) {
        case 'up': newY = Math.max(0, prev.y - 1); break
        case 'down': newY = Math.min(gridSize - 1, prev.y + 1); break
        case 'left': newX = Math.max(0, prev.x - 1); break
        case 'right': newX = Math.min(gridSize - 1, prev.x + 1); break
        default: break
      }
      if (isWall(newX, newY)) return prev
      setDots(prevDots => {
        const newDots = prevDots.filter(dot => !(dot.x === newX && dot.y === newY))
        if (newDots.length < prevDots.length) setScore(s => s + 10)
        if (newDots.length === 0) setGameOver(true)
        return newDots
      })
      return { x: newX, y: newY }
    })
  }, [isWall])

  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts =>
      prevGhosts.map(ghost => {
        let newX = ghost.x, newY = ghost.y, newDir = ghost.dir
        switch (ghost.dir) {
          case 'up': if (ghost.y > 0 && !isWall(ghost.x, ghost.y - 1)) newY = ghost.y - 1; else newDir = 'down'; break
          case 'down': if (ghost.y < gridSize - 1 && !isWall(ghost.x, ghost.y + 1)) newY = ghost.y + 1; else newDir = 'up'; break
          case 'left': if (ghost.x > 0 && !isWall(ghost.x - 1, ghost.y)) newX = ghost.x - 1; else newDir = 'right'; break
          case 'right': if (ghost.x < gridSize - 1 && !isWall(ghost.x + 1, ghost.y)) newX = ghost.x + 1; else newDir = 'left'; break
          default: break
        }
        return { ...ghost, x: newX, y: newY, dir: newDir }
      })
    )
  }, [isWall])

  useEffect(() => {
    const collision = ghosts.some(ghost => ghost.x === pacman.x && ghost.y === pacman.y)
    if (collision && !gameOver) {
      alert('💀 Oh no! The Grinch got the gifts! Score: ' + score)
      setGameOver(true)
    }
  }, [pacman, ghosts, gameOver, score])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const pI = setInterval(movePacman, 150)
    const gI = setInterval(moveGhosts, 180)
    return () => { clearInterval(pI); clearInterval(gI); }
  }, [gameStarted, gameOver, movePacman, moveGhosts])

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': directionRef.current = 'up'; break
        case 'ArrowDown': directionRef.current = 'down'; break
        case 'ArrowLeft': directionRef.current = 'left'; break
        case 'ArrowRight': directionRef.current = 'right'; break
        default: break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const startGame = () => {
    setGameStarted(true); setScore(0); setGameOver(false); setPacman({ x: 1, y: 1 }); directionRef.current = 'right'
  }

  if (!gameStarted) {
    return (
      <div className="pacman-game">
        <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
        <div className="page-overlay"></div>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontFamily: "'Mountains of Christmas', cursive" }}>🎅 Santa's Dash</h1>
          <p style={{ fontSize: '1.2rem', margin: '1rem 0', color: '#ffd700' }}>
            Help Santa collect all snowflakes ❄️<br />
            Avoid the Grinch 👺!
          </p>
          <button onClick={startGame} className="btn-christmas-premium">START MAGIC✨</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pacman-game">
      <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
      <div className="page-overlay"></div>
      <div className="game-header" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: "'Mountains of Christmas', cursive", color: '#fff' }}>🎅 Joy Points: {score}</h1>
        <button onClick={startGame} className="btn-secondary" style={{ margin: '1rem' }}>Reset Magic</button>
      </div>

      <div className="game-board" style={{
        width: gridSize * cellSize, height: gridSize * cellSize, position: 'relative', margin: '1rem auto',
        background: 'rgba(0,0,0,0.8)', border: '4px solid #d4145a', borderRadius: '15px', zIndex: 10
      }}>
        {/* Walls */}
        {walls.map((wall, idx) => (
          <div key={idx} style={{
            position: 'absolute', left: wall.x * cellSize, top: wall.y * cellSize, width: cellSize, height: cellSize,
            background: '#2e8b57', border: '1px solid #3cb371', borderRadius: '5px'
          }} />
        ))}
        {/* Snowflakes */}
        {dots.map((dot, idx) => (
          <div key={idx} style={{
            position: 'absolute', left: dot.x * cellSize, top: dot.y * cellSize, width: cellSize, height: cellSize,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
          }}>❄️</div>
        ))}
        {/* Santa */}
        <div style={{
          position: 'absolute', left: pacman.x * cellSize, top: pacman.y * cellSize, width: cellSize, height: cellSize,
          fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s'
        }}>🎅</div>
        {/* Grinches */}
        {ghosts.map((ghost, idx) => (
          <div key={idx} style={{
            position: 'absolute', left: ghost.x * cellSize, top: ghost.y * cellSize, width: cellSize, height: cellSize,
            fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}>👺</div>
        ))}
        {gameOver && (
          <div className="game-over-overlay" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '11px'
          }}>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>Holiday Highlights!</h2>
            <p style={{ fontSize: '1.5rem', color: '#ffd700' }}>Score: {score}</p>
            <button onClick={startGame} className="btn-christmas-premium">Play Again ✨</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PacManGame
