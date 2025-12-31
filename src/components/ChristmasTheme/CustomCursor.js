import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const trailRefs = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }

            trailRefs.current.forEach((trail, i) => {
                const speed = (i + 1) * 2; // Staggered delay effect handled largely by CSS transition if complex, but here we do immediate with slight lag logic if we wanted. 
                // However, for best "trail" effect without complex state, we just position them at the mouse but with transition delay in CSS or JS interpolation.
                // Let's stick to the fast "snake" logic which is robust.

                // Better snake logic:
                // We actually need to store previous positions for a true snake.
                // But for "sparkles dropping behind", we can't easily do that without state loop.
                // Let's stick to the "follow with lag" interpolation.

                // Existing logic was: trail[i] moves to trail[i-1]. This creates a snake.
            });

            // Snake logic copy from previous works best for smooth trails
            for (let i = trailRefs.current.length - 1; i > 0; i--) {
                const current = trailRefs.current[i];
                const prev = trailRefs.current[i - 1];
                if (current && prev) {
                    current.style.transform = prev.style.transform;
                }
            }
            if (trailRefs.current[0]) {
                trailRefs.current[0].style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Sparkling Magic Trail */}
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 9999,
                        // Visuals
                        width: `${12 - i}px`,
                        height: `${12 - i}px`,
                        background: i % 2 === 0 ? '#ffd700' : '#d4145a',
                        borderRadius: '50%',
                        opacity: 0.6 - i / 20,
                        boxShadow: `0 0 ${10 - i}px ${i % 2 === 0 ? '#ffd700' : '#d4145a'}`,
                        willChange: 'transform',
                        mixBlendMode: 'screen'
                    }}
                />
            ))}

            {/* Main Cursor: Glowing Wand Tip */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: -10,
                    left: -10,
                    zIndex: 10000,
                    pointerEvents: 'none',
                    // Visuals
                    width: '20px',
                    height: '20px',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    background: 'rgba(255, 215, 0, 0.3)',
                    boxShadow: '0 0 15px #ffd700, inset 0 0 10px #ffd700',
                    backdropFilter: 'blur(2px)'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '4px',
                    height: '4px',
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #fff'
                }}></div>
            </div>
        </>
    );
};

export default CustomCursor;
