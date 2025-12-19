import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const trailRefs = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;

            // Super fast direct DOM update
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }

            // High performance trail tracking
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
            {/* Pure Christmas Snowflake Trail */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 9999,
                        color: '#ffd700',
                        fontSize: `${16 - i}px`,
                        opacity: 1 - i / 12,
                        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                        willChange: 'transform'
                    }}
                >
                    <i className="fas fa-snowflake"></i>
                </div>
            ))}
            {/* Christmas Gold Cursor Point */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: -8,
                    left: -8,
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ffd700',
                    border: '1px solid #fff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    boxShadow: '0 0 15px #ffd700',
                    willChange: 'transform'
                }}
            />
        </>
    );
};

export default CustomCursor;
