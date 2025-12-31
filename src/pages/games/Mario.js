import { useState, useEffect, useRef } from 'react'

function Mario() {
    const canvasRef = useRef(null)
    const [gameState, setGameState] = useState('menu') // menu, countdown, playing, gameover
    const [score, setScore] = useState(0)
    const [countdown, setCountdown] = useState(3)

    const gameRef = useRef({
        santaY: 300,
        santady: 0,
        obstacles: [],
        frameCount: 0,
        speed: 5
    })

    // Controls
    const jump = () => {
        if (gameRef.current.santaY >= 350) {
            gameRef.current.santady = -15
        }
    }

    useEffect(() => {
        if (gameState !== 'playing') return

        const handleKeyDown = (e) => {
            if (e.code === 'Space') jump()
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('touchstart', jump)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId

        const loop = () => {
            const state = gameRef.current
            state.frameCount++

            // Update Santa
            state.santaY += state.santady
            state.santady += 0.8 // Gravity
            if (state.santaY > 350) { // Ground
                state.santaY = 350
                state.santady = 0
            }

            // Add Obstacles
            if (state.frameCount % 100 === 0) {
                state.obstacles.push({
                    x: canvas.width,
                    y: 370,
                    w: 30,
                    h: 30,
                    type: Math.random() > 0.5 ? 'tree' : 'rock'
                })
                if (state.frameCount % 500 === 0) state.speed += 0.5
            }

            // Move Obstacles
            state.obstacles.forEach(obs => obs.x -= state.speed)
            state.obstacles = state.obstacles.filter(obs => obs.x > -50)

            // Collision
            let collision = false
            state.obstacles.forEach(obs => {
                if (
                    100 < obs.x + obs.w &&
                    100 + 40 > obs.x &&
                    state.santaY < obs.y + obs.h &&
                    state.santaY + 50 > obs.y
                ) {
                    collision = true
                }
            })

            if (collision) {
                setGameState('gameover')
            }

            // Score
            setScore(Math.floor(state.frameCount / 10))

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Ground
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 400, canvas.width, 100)

            // Santa
            ctx.fillStyle = '#d4145a'
            ctx.fillRect(100, state.santaY, 40, 50)
            // Hat
            ctx.fillStyle = '#fff'
            ctx.fillRect(100, state.santaY - 10, 40, 10)

            // Obstacles
            state.obstacles.forEach(obs => {
                ctx.fillStyle = obs.type === 'tree' ? '#2ecc71' : '#7f8c8d'
                if (obs.type === 'tree') {
                    ctx.beginPath()
                    ctx.moveTo(obs.x + 15, obs.y - 20)
                    ctx.lineTo(obs.x + 30, obs.y + 30)
                    ctx.lineTo(obs.x, obs.y + 30)
                    ctx.fill()
                } else {
                    ctx.fillRect(obs.x, obs.y, 30, 30)
                }
            })

            // Score
            ctx.fillStyle = '#fff'
            ctx.font = '24px Arial'
            ctx.fillText(`Score: ${Math.floor(state.frameCount / 10)}`, 20, 40)

            if (!collision) animationFrameId = requestAnimationFrame(loop)
        }

        loop()
        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('touchstart', jump)
        }
    }, [gameState])

    const startGameSequence = () => {
        setGameState('countdown')
        setCountdown(3)
        let count = 3

        // Reset Game State
        gameRef.current = {
            santaY: 300,
            santady: 0,
            obstacles: [],
            frameCount: 0,
            speed: 5
        }
        setScore(0)

        const timer = setInterval(() => {
            count--
            setCountdown(count)
            if (count === 0) {
                clearInterval(timer)
                setGameState('playing')
            }
        }, 1000)
    }

    return (
        <div className="game-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
            <div className="page-overlay"></div>

            {/* MENU */}
            {gameState === 'menu' && (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>
                        Holiday Run
                    </h1>

                    <div style={{ margin: '2rem 0', color: '#ccc', textAlign: 'left', display: 'inline-block' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <i className="fas fa-keyboard"></i> <b>Keyboard:</b>
                            <span style={{ marginLeft: '10px' }}>Press <b>SPACE</b> to Jump</span>
                        </div>
                        <div>
                            <i className="fas fa-mobile-alt"></i> <b>Touch:</b>
                            <span style={{ marginLeft: '10px' }}>Tap Screen or Button</span>
                        </div>
                    </div>

                    <button className="btn-christmas-premium" onClick={startGameSequence}>Single Player</button>
                </div>
            )}

            {/* COUNTDOWN */}
            {gameState === 'countdown' && (
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontSize: '8rem', color: '#ffd700', fontFamily: "'Mountains of Christmas', cursive" }}>
                        {countdown > 0 ? countdown : 'GO!'}
                    </h1>
                </div>
            )}

            {/* PLAYING */}
            {gameState === 'playing' && (
                <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
                    <div className="glass-card" style={{ padding: '1rem', zIndex: 10 }}>
                        <canvas ref={canvasRef} width={800} height={450} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '10px', maxWidth: '100%', height: 'auto' }} />
                    </div>

                    {/* Mobile Jump Button */}
                    <button
                        onTouchStart={(e) => { e.preventDefault(); jump(); }}
                        onMouseDown={(e) => { e.preventDefault(); jump(); }}
                        className="btn-christmas"
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            fontSize: '2rem',
                            zIndex: 20,
                            opacity: 0.8
                        }}
                    >
                        ⬆️
                    </button>
                </div>
            )}

            {/* GAME OVER */}
            {gameState === 'gameover' && (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#ff4d4d', marginBottom: '1rem' }}>Game Over!</h1>
                    <p style={{ fontSize: '1.5rem', color: '#ffd700', marginBottom: '2rem' }}>Final Score: {score}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn-christmas-premium" onClick={startGameSequence}>
                            <i className="fas fa-redo"></i> Try Again
                        </button>
                        <button className="btn-secondary" onClick={() => setGameState('menu')}>
                            <i className="fas fa-home"></i> Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Mario
