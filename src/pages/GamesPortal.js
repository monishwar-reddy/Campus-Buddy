import { Link } from 'react-router-dom'

function GamesPortal() {
    const games = [
        {
            id: 'santa-dash',
            name: "Santa's Dash",
            description: "Help Santa collect gifts and avoid the Grinch in this Pac-Man style adventure!",
            icon: <i className="fas fa-ghost"></i>,
            link: "/games/santa-dash",
            color: "#d4145a"
        },
        {
            id: 'tic-tac-toe',
            name: "Frosty Tic-Tac-Toe",
            description: "Classic Xs and Os with a festive twist. Challenge yourself or a friend!",
            icon: <i className="fas fa-snowflake"></i>,
            link: "/games/tic-tac-toe",
            color: "#3cb371"
        },
        {
            id: 'pong',
            name: "Snowball Pong",
            description: "Bounce the snowball past your opponent. Classic arcade action!",
            icon: <i className="fas fa-table-tennis"></i>,
            link: "/games/pong",
            color: "#1e90ff"
        },
        {
            id: 'mario',
            name: "Holiday Run",
            description: "Jump over snowy obstacles in this festive platformer!",
            icon: <i className="fas fa-running"></i>,
            link: "/games/mario",
            color: "#ffd700"
        }
    ]

    return (
        <div className="games-portal">
            <div className="page-background" style={{ backgroundImage: 'url(/images/game-bg.jpg)' }}></div>
            <div className="page-overlay"></div>

            <div className="container relative-z" style={{ paddingTop: '6rem' }}>
                <h1 className="section-title text-center" style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '4rem', marginBottom: '3rem' }}>
                    <i className="fas fa-gamepad"></i> Festive Arcade
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {games.map(game => (
                        <Link to={game.link} key={game.id} style={{ textDecoration: 'none' }}>
                            <div className="glass-card-3d" style={{
                                padding: '2rem',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease',
                                border: `2px solid ${game.color}`
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem', color: game.color }}>{game.icon}</div>
                                <h2 style={{ color: game.color, fontFamily: "'Mountains of Christmas', cursive", fontSize: '2rem', marginBottom: '1rem' }}>{game.name}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{game.description}</p>
                                <div className="btn-christmas-premium" style={{ marginTop: 'auto' }}>
                                    <i className="fas fa-play" style={{ marginRight: '10px' }}></i> PLAY NOW
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GamesPortal
