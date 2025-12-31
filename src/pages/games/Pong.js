import { useState, useEffect, useRef } from 'react'

function Pong() {
    const canvasRef = useRef(null)
    const [gameState, setGameState] = useState('menu') // menu, countdown, playing
    const [gameMode, setGameMode] = useState(null)
    const [score, setScore] = useState({ p1: 0, p2: 0 })
    const [countdown, setCountdown] = useState(3)

    const gameRef = useRef({
        p1y: 200, p2y: 200,
        bx: 400, by: 250,
        bdx: 5, bdy: 5,
        keys: {}
    })

    useEffect(() => {
        const handleKeyDown = (e) => gameRef.current.keys[e.key] = true
        const handleKeyUp = (e) => gameRef.current.keys[e.key] = false
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useEffect(() => {
        if (gameState !== 'playing') return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId

        const loop = () => {
            const state = gameRef.current

            // Move Paddles
            if (state.keys['w']) state.p1y = Math.max(0, state.p1y - 7)
            if (state.keys['s']) state.p1y = Math.min(canvas.height - 80, state.p1y + 7)

            if (gameMode === 'multi') {
                if (state.keys['ArrowUp']) state.p2y = Math.max(0, state.p2y - 7)
                if (state.keys['ArrowDown']) state.p2y = Math.min(canvas.height - 80, state.p2y + 7)
            } else {
                // AI
                const center = state.p2y + 40
                if (center < state.by - 10) state.p2y += 4
                else if (center > state.by + 10) state.p2y -= 4
            }

            // Move Ball
            state.bx += state.bdx
            state.by += state.bdy

            // Bounce Top/Bottom
            if (state.by <= 0 || state.by >= canvas.height) state.bdy *= -1

            // Paddle Collision
            if (state.bx <= 30 && state.by >= state.p1y && state.by <= state.p1y + 80) {
                state.bdx = Math.abs(state.bdx) * 1.05
            }
            if (state.bx >= canvas.width - 30 && state.by >= state.p2y && state.by <= state.p2y + 80) {
                state.bdx = -Math.abs(state.bdx) * 1.05
            }

            // Score
            if (state.bx < 0) {
                setScore(s => ({ ...s, p2: s.p2 + 1 }))
                resetBall(state, canvas)
            }
            if (state.bx > canvas.width) {
                setScore(s => ({ ...s, p1: s.p1 + 1 }))
                resetBall(state, canvas)
            }

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Net
            ctx.setLineDash([10, 10])
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 0)
            ctx.lineTo(canvas.width / 2, canvas.height)
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'
            ctx.stroke()

            // Paddles
            ctx.fillStyle = '#ff4d4d'
            ctx.fillRect(10, state.p1y, 20, 80)
            ctx.fillStyle = '#2ecc71'
            ctx.fillRect(canvas.width - 30, state.p2y, 20, 80)

            // Ball
            ctx.beginPath()
            ctx.arc(state.bx, state.by, 8, 0, Math.PI * 2)
            ctx.fillStyle = '#fff'
            ctx.fill()

            animationFrameId = requestAnimationFrame(loop)
        }

        loop()
        return () => cancelAnimationFrame(animationFrameId)
    }, [gameState, gameMode])

    const resetBall = (state, canvas) => {
        state.bx = canvas.width / 2
        state.by = canvas.height / 2
        state.bdx = (Math.random() > 0.5 ? 5 : -5)
        state.bdy = (Math.random() * 6 - 3)
    }

    const startGameSequence = (mode) => {
        setGameMode(mode)
        setScore({ p1: 0, p2: 0 })
        setGameState('countdown')
        setCountdown(3)
        let count = 3

        // Reset positions
        gameRef.current.p1y = 200
        gameRef.current.p2y = 200
        gameRef.current.bx = 400
        gameRef.current.by = 250
        gameRef.current.bdx = 5

        const timer = setInterval(() => {
            count--
            setCountdown(count)
            if (count === 0) {
                clearInterval(timer)
                setGameState('playing')
            }
        }, 1000)
    }

    const handleTouchStart = (key) => { gameRef.current.keys[key] = true }
    const handleTouchEnd = (key) => { gameRef.current.keys[key] = false }

    return (
        <div className="game-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
            <div className="page-overlay"></div>

            {/* MENU */}
            {gameState === 'menu' && (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>Snowball Pong</h1>

                    <div style={{ margin: '2rem 0', color: '#ccc', textAlign: 'left', display: 'inline-block' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <i className="fas fa-keyboard"></i> <b>Keyboard:</b><br />
                            <span style={{ marginLeft: '20px' }}>P1: <b>W</b> / <b>S</b></span><br />
                            <span style={{ marginLeft: '20px' }}>P2: <b>Up</b> / <b>Down</b></span>
                        </div>
                        <div>
                            <i className="fas fa-mobile-alt"></i> <b>Touch:</b><br />
                            <span style={{ marginLeft: '20px' }}>Use on-screen buttons</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem' }}>
                        <button className="btn-christmas-premium" onClick={() => startGameSequence('single')}>Single Player</button>
                        <button className="btn-christmas-premium" onClick={() => startGameSequence('multi')}>Multiplayer</button>
                    </div>
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
                <>
                    <div className="glass-card" style={{ padding: '1rem', textAlign: 'center', zIndex: 10, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontFamily: "'Mountains of Christmas', cursive", color: '#fff', marginBottom: '1rem', width: '100%', maxWidth: '800px' }}>
                            <span style={{ color: '#ff4d4d' }}>Player 1: {score.p1}</span>
                            <span style={{ color: '#2ecc71' }}>Player 2: {score.p2}</span>
                        </div>

                        <canvas ref={canvasRef} width={800} height={500} style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid #fff', borderRadius: '10px', maxWidth: '100%', height: 'auto' }} />

                        <button className="btn-secondary" onClick={() => setGameState('menu')} style={{ marginTop: '1rem' }}>
                            <i className="fas fa-sign-out-alt"></i> Exit
                        </button>
                    </div>

                    {/* Mobile Controls Overlay */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginTop: '10px', zIndex: 20 }}>
                        {/* P1 Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onTouchStart={() => handleTouchStart('w')}
                                onTouchEnd={() => handleTouchEnd('w')}
                                onMouseDown={() => handleTouchStart('w')}
                                onMouseUp={() => handleTouchEnd('w')}
                                className="btn-christmas" style={{ padding: '20px', fontSize: '1.5rem' }}>W / ⬆️</button>
                            <button
                                onTouchStart={() => handleTouchStart('s')}
                                onTouchEnd={() => handleTouchEnd('s')}
                                onMouseDown={() => handleTouchStart('s')}
                                onMouseUp={() => handleTouchEnd('s')}
                                className="btn-christmas" style={{ padding: '20px', fontSize: '1.5rem' }}>S / ⬇️</button>
                        </div>

                        {/* P2 Controls (Only if Multi) */}
                        {gameMode === 'multi' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onTouchStart={() => handleTouchStart('ArrowUp')}
                                    onTouchEnd={() => handleTouchEnd('ArrowUp')}
                                    onMouseDown={() => handleTouchStart('ArrowUp')}
                                    onMouseUp={() => handleTouchEnd('ArrowUp')}
                                    className="btn-christmas" style={{ padding: '20px', fontSize: '1.5rem' }}>⬆️</button>
                                <button
                                    onTouchStart={() => handleTouchStart('ArrowDown')}
                                    onTouchEnd={() => handleTouchEnd('ArrowDown')}
                                    onMouseDown={() => handleTouchStart('ArrowDown')}
                                    onMouseUp={() => handleTouchEnd('ArrowDown')}
                                    className="btn-christmas" style={{ padding: '20px', fontSize: '1.5rem' }}>⬇️</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Pong
