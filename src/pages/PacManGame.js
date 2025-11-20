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
  
  // Walls (barriers) - like original Pac-Man with more obstacles
  const walls = [
    // Top horizontal barriers
    { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
    { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 },
    // Left vertical barrier
    { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 },
    // Right vertical barrier
    { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 },
    // Center cross barrier
    { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 },
    { x: 7, y: 6 }, { x: 7, y: 8 },
    // Middle horizontal barriers
    { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 },
    // Bottom barriers
    { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 },
    { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 },
    { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
    { x: 3, y: 12 }, { x: 4, y: 12 }, { x: 10, y: 12 }, { x: 11, y: 12 }
  ]
  
  const isWall = useCallback((x, y) => {
    return walls.some(w => w.x === x && w.y === y)
  }, [])

  // Initialize dots
  useEffect(() => {
    const initialDots = []
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Don't place dots where pacman or ghosts start or on walls
        const isStartPosition = (x === 1 && y === 1) || 
                               (x === 13 && y === 1) || 
                               (x === 1 && y === 13) ||
                               (x === 13 && y === 13) ||
                               (x === 6 && y === 3)
        if (!isStartPosition && !isWall(x, y)) {
          initialDots.push({ x, y })
        }
      }
    }
    setDots(initialDots)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Move Pac-Man
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

      // Check if hitting wall
      if (isWall(newX, newY)) {
        return prev // Don't move
      }

      // Check if Pac-Man ate a dot
      setDots(prevDots => {
        const newDots = prevDots.filter(dot => !(dot.x === newX && dot.y === newY))
        if (newDots.length < prevDots.length) {
          setScore(s => s + 10)
        }
        if (newDots.length === 0) {
          setScore(s => {
            alert('🎉 You Win! Score: ' + (s + 10))
            setGameOver(true)
            return s
          })
        }
        return newDots
      })

      return { x: newX, y: newY }
    })
  }, [isWall])

  // Move ghosts - continuous movement avoiding walls
  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => {
        let newX = ghost.x
        let newY = ghost.y
        let newDir = ghost.dir

        // Try to move in current direction
        switch (ghost.dir) {
          case 'up': 
            if (ghost.y > 0 && !isWall(ghost.x, ghost.y - 1)) {
              newY = ghost.y - 1
            } else {
              newDir = 'down'
            }
            break
          case 'down': 
            if (ghost.y < gridSize - 1 && !isWall(ghost.x, ghost.y + 1)) {
              newY = ghost.y + 1
            } else {
              newDir = 'up'
            }
            break
          case 'left': 
            if (ghost.x > 0 && !isWall(ghost.x - 1, ghost.y)) {
              newX = ghost.x - 1
            } else {
              newDir = 'right'
            }
            break
          case 'right': 
            if (ghost.x < gridSize - 1 && !isWall(ghost.x + 1, ghost.y)) {
              newX = ghost.x + 1
            } else {
              newDir = 'left'
            }
            break
          default: break
        }

        // Randomly change direction more often for roaming behavior
        if (Math.random() < 0.2) {
          const directions = ['up', 'down', 'left', 'right']
          const randomDir = directions[Math.floor(Math.random() * directions.length)]
          
          // Check if the random direction is valid
          let canMove = false
          switch (randomDir) {
            case 'up': canMove = ghost.y > 0 && !isWall(ghost.x, ghost.y - 1); break
            case 'down': canMove = ghost.y < gridSize - 1 && !isWall(ghost.x, ghost.y + 1); break
            case 'left': canMove = ghost.x > 0 && !isWall(ghost.x - 1, ghost.y); break
            case 'right': canMove = ghost.x < gridSize - 1 && !isWall(ghost.x + 1, ghost.y); break
            default: break
          }
          
          if (canMove) {
            newDir = randomDir
          }
        }
        
        // If stuck, try all directions
        if (newX === ghost.x && newY === ghost.y) {
          const directions = ['up', 'down', 'left', 'right']
          for (const dir of directions) {
            let testX = ghost.x
            let testY = ghost.y
            switch (dir) {
              case 'up': testY = ghost.y - 1; break
              case 'down': testY = ghost.y + 1; break
              case 'left': testX = ghost.x - 1; break
              case 'right': testX = ghost.x + 1; break
              default: break
            }
            if (testX >= 0 && testX < gridSize && testY >= 0 && testY < gridSize && !isWall(testX, testY)) {
              newX = testX
              newY = testY
              newDir = dir
              break
            }
          }
        }

        return { ...ghost, x: newX, y: newY, dir: newDir }
      })
    )
  }, [isWall])

  // Check collision with ghosts
  useEffect(() => {
    const collision = ghosts.some(ghost => ghost.x === pacman.x && ghost.y === pacman.y)
    if (collision && !gameOver) {
      alert('💀 Game Over! Score: ' + score)
      setGameOver(true)
    }
  }, [pacman, ghosts, gameOver, score])

  // Game loop - continuous movement (runs once when game starts)
  useEffect(() => {
    if (!gameStarted || gameOver) return
    
    const pacmanInterval = setInterval(() => {
      movePacman()
    }, 150)
    
    const ghostInterval = setInterval(() => {
      moveGhosts()
    }, 180)

    return () => {
      clearInterval(pacmanInterval)
      clearInterval(ghostInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted])

  // Keyboard controls
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
    setGameStarted(true)
    setScore(0)
    setGameOver(false)
    setPacman({ x: 1, y: 1 })
    directionRef.current = 'right'
    setGhosts([
      { x: 13, y: 1, color: '#ff0000', dir: 'left' },
      { x: 1, y: 13, color: '#00ffff', dir: 'right' },
      { x: 13, y: 13, color: '#ffb8ff', dir: 'up' },
      { x: 6, y: 3, color: '#ffb852', dir: 'down' }
    ])
    
    const initialDots = []
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const isStartPosition = (x === 1 && y === 1) || 
                               (x === 8 && y === 8) || 
                               (x === 10 && y === 8) ||
                               (x === 8 && y === 10) ||
                               (x === 10 && y === 10)
        if (!isStartPosition && !isWall(x, y)) {
          initialDots.push({ x, y })
        }
      }
    }
    setDots(initialDots)
  }

  // Show start screen
  if (!gameStarted) {
    return (
      <div className="pacman-game">
        <div 
          className="game-board"
          style={{
            width: gridSize * cellSize,
            height: gridSize * cellSize,
            position: 'relative',
            margin: '2rem auto',
            background: '#000',
            border: '4px solid #ff6b6b',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            textAlign: 'center',
            color: '#fff',
            padding: '2rem'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮 PAC-MAN</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#ffeb3b' }}>
              Use Arrow Keys to move 🟡<br/>
              Eat all dots • Avoid ghosts 👻
            </p>
            <button 
              onClick={startGame}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.5rem',
                background: '#ffeb3b',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#000',
                boxShadow: '0 4px 15px rgba(255, 235, 59, 0.5)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              START GAME
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pacman-game">
      <div className="game-header">
        <h1>🎮 Pac-Man Game</h1>
        <div className="game-info">
          <div className="score">Score: {score}</div>
          <button className="reset-btn" onClick={startGame}>New Game</button>
        </div>
      </div>

      <div className="game-instructions">
        <p>Use Arrow Keys to move Pac-Man 🟡</p>
        <p>Eat all dots • Avoid ghosts 👻</p>
      </div>

      <div 
        className="game-board"
        style={{
          width: gridSize * cellSize,
          height: gridSize * cellSize,
          position: 'relative',
          margin: '2rem auto',
          background: '#000',
          border: '4px solid #ff6b6b',
          borderRadius: '10px'
        }}
      >
        {/* Walls */}
        {walls.map((wall, idx) => (
          <div
            key={`wall-${idx}`}
            style={{
              position: 'absolute',
              left: wall.x * cellSize,
              top: wall.y * cellSize,
              width: cellSize,
              height: cellSize,
              background: '#1e40af',
              border: '1px solid #3b82f6',
              borderRadius: '3px'
            }}
          />
        ))}

        {/* Dots */}
        {dots.map((dot, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: dot.x * cellSize + cellSize / 2 - 3,
              top: dot.y * cellSize + cellSize / 2 - 3,
              width: '6px',
              height: '6px',
              background: '#fff',
              borderRadius: '50%'
            }}
          />
        ))}

        {/* Pac-Man */}
        <div
          style={{
            position: 'absolute',
            left: pacman.x * cellSize,
            top: pacman.y * cellSize,
            width: cellSize,
            height: cellSize,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.1s'
          }}
        >
          🟡
        </div>

        {/* Ghosts */}
        {ghosts.map((ghost, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: ghost.x * cellSize,
              top: ghost.y * cellSize,
              width: cellSize,
              height: cellSize,
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            👻
          </div>
        ))}

        {gameOver && (
          <div className="game-over-overlay">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-buttons">
          <button onClick={() => directionRef.current = 'up'}>↑</button>
          <div>
            <button onClick={() => directionRef.current = 'left'}>←</button>
            <button onClick={() => directionRef.current = 'down'}>↓</button>
            <button onClick={() => directionRef.current = 'right'}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PacManGame
