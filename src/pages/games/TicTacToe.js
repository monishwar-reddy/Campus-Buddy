import { useState, useEffect } from 'react'

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [xIsNext, setXIsNext] = useState(true)
    const [gameState, setGameState] = useState('menu') // menu, countdown, playing, finished
    const [gameMode, setGameMode] = useState(null) // 'single', 'multi'
    const [winner, setWinner] = useState(null)
    const [countdown, setCountdown] = useState(3)

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
        return null
    }

    const handleClick = (i) => {
        if (gameState !== 'playing' || board[i] || (gameMode === 'single' && !xIsNext)) return

        const newBoard = [...board]
        newBoard[i] = xIsNext ? 'X' : 'O'
        setBoard(newBoard)

        const w = checkWinner(newBoard)
        if (w) {
            setWinner(w)
            setGameState('finished')
        } else if (!newBoard.includes(null)) {
            setWinner('draw')
            setGameState('finished')
        } else {
            setXIsNext(!xIsNext)
        }
    }

    // AI Move
    useEffect(() => {
        if (gameState === 'playing' && gameMode === 'single' && !xIsNext && !winner) {
            const timer = setTimeout(() => {
                const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null)
                if (availableMoves.length > 0) {
                    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
                    const newBoard = [...board]
                    newBoard[randomMove] = 'O'
                    setBoard(newBoard)

                    const w = checkWinner(newBoard)
                    if (w) {
                        setWinner(w)
                        setGameState('finished')
                    } else if (!newBoard.includes(null)) {
                        setWinner('draw')
                        setGameState('finished')
                    } else {
                        setXIsNext(true)
                    }
                }
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [xIsNext, gameMode, winner, board, gameState])

    const startGameSequence = (mode) => {
        setGameMode(mode)
        setGameState('countdown')
        setCountdown(3)
        let count = 3
        const timer = setInterval(() => {
            count--
            setCountdown(count)
            if (count === 0) {
                clearInterval(timer)
                setGameState('playing')
                setBoard(Array(9).fill(null))
                setXIsNext(true)
                setWinner(null)
            }
        }, 1000)
    }

    const resetToMenu = () => {
        setGameState('menu')
        setBoard(Array(9).fill(null))
        setWinner(null)
    }

    const renderSquare = (i) => {
        const val = board[i]
        return (
            <button
                className="tictactoe-square"
                onClick={() => handleClick(i)}
                style={{
                    width: '100px', height: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    fontSize: '3rem',
                    color: val === 'X' ? '#ff4d4d' : '#2ecc71',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {val === 'X' ? <i className="fas fa-candy-cane"></i> : (val === 'O' ? <i className="fas fa-tree"></i> : '')}
            </button>
        )
    }

    return (
        <div className="game-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
            <div className="page-overlay"></div>

            {/* MENU STATE */}
            {gameState === 'menu' && (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>Frosty Tic-Tac-Toe</h1>

                    <div style={{ margin: '2rem 0', color: '#ccc', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            <i className="fas fa-mouse-pointer" style={{ marginRight: '10px' }}></i>
                            <span style={{ marginRight: '20px' }}>Click</span>
                            or
                            <i className="fas fa-hand-pointer" style={{ marginLeft: '20px', marginRight: '10px' }}></i>
                            <span>Tap</span>
                        </div>
                        <p>Place 3 marks in a row to win!</p>
                    </div>

                    <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                        <span style={{ color: '#ff4d4d' }}><i className="fas fa-candy-cane"></i> Candy Cane</span> vs <span style={{ color: '#2ecc71' }}><i className="fas fa-tree"></i> Tree</span>
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <button className="btn-christmas-premium" onClick={() => startGameSequence('single')}>Single Player</button>
                        <button className="btn-christmas-premium" onClick={() => startGameSequence('multi')}>Multiplayer</button>
                    </div>
                </div>
            )}

            {/* COUNTDOWN STATE */}
            {gameState === 'countdown' && (
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontSize: '8rem', color: '#ffd700', fontFamily: "'Mountains of Christmas', cursive" }}>
                        {countdown > 0 ? countdown : 'GO!'}
                    </h1>
                </div>
            )}

            {/* PLAYING / FINISHED STATE */}
            {(gameState === 'playing' || gameState === 'finished') && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', zIndex: 10 }}>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>
                        {winner ?
                            (winner === 'draw' ? "It's a Tie! ❄️" : <span>{winner === 'X' ? 'Candy Cane' : 'Tree'} Wins! 🎉</span>)
                            : `Turn: ${xIsNext ? 'Candy Cane' : 'Tree'}`}
                    </h1>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                        {Array(9).fill(null).map((_, i) => renderSquare(i))}
                    </div>

                    {gameState === 'finished' && (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn-christmas-premium" onClick={() => startGameSequence(gameMode)}>
                                <i className="fas fa-redo"></i> Play Again
                            </button>
                            <button className="btn-secondary" onClick={resetToMenu}>
                                <i className="fas fa-home"></i> Home
                            </button>
                        </div>
                    )}
                    {gameState === 'playing' && (
                        <button className="btn-secondary" onClick={resetToMenu} style={{ marginTop: '1rem' }}>
                            <i className="fas fa-sign-out-alt"></i> Exit
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default TicTacToe
