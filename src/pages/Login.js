import React, { useState, useContext } from 'react'
import { UserContext } from '../context/UserContext'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const { loginWithProvider } = useContext(UserContext)

    const handleSocialLogin = async (provider) => {
        setLoading(true)
        try {
            await loginWithProvider(provider)
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => setLoading(false), 3000)
        }
    }

    return (
        <div className="login-page" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #020024 0%, #c41e3a 100%)', /* Red-tinged background */
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1000
        }}>
            {/* Animated Festive Background Elements */}
            <div className="floating-gift" style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '4rem', color: '#ffd700' }}><i className="fas fa-gift"></i></div>
            <div className="floating-gift" style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '5rem', animationDelay: '1s', color: '#ffd700' }}><i className="fas fa-tree"></i></div>
            <div className="floating-gift" style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: '3rem', animationDelay: '2s', color: '#ffd700' }}><i className="fas fa-snowflake"></i></div>
            <div className="floating-gift" style={{ position: 'absolute', bottom: '10%', right: '10%', fontSize: '4.5rem', animationDelay: '0.5s', color: '#ffd700' }}><i className="fas fa-user-ninja"></i></div>
            <div className="floating-gift" style={{ position: 'absolute', top: '50%', left: '5%', fontSize: '2.5rem', animationDelay: '1.5s', color: '#ffd700' }}><i className="fas fa-star"></i></div>

            <div className="post-card" style={{
                padding: '4rem',
                textAlign: 'center',
                maxWidth: '450px',
                width: '90%',
                border: '1px solid #ffd700',
                boxShadow: '0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(255, 215, 0, 0.2)'
            }}>
                <h1 style={{
                    fontFamily: "'Mountains of Christmas', cursive",
                    fontSize: '4.5rem',
                    marginBottom: '1rem',
                    color: '#ffd700'
                }}>
                    Welcome <br /> Home! <i className="fas fa-snowflake" style={{ fontSize: '3.5rem' }}></i>
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                    Enter the magical campus community.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
                    <button
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                        className="btn-christmas-premium"
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            background: '#db4437',
                            border: '2px solid #fff'
                        }}
                    >
                        <i className="fab fa-google"></i> {loading ? 'Redirecting...' : 'Login with Google'}
                    </button>
                </div>

                <p style={{ marginTop: '2rem', fontSize: '1rem', opacity: 0.8 }}>
                    Magical access to notes, AI, and gifts! <i className="fas fa-magic"></i>
                </p>
            </div>
        </div>
    )
}

export default Login
