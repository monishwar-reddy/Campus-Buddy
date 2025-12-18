import React from 'react';

const SantaSilhouette = () => {
    return (
        <svg
            width="150"
            height="50"
            viewBox="0 0 150 50"
            style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                opacity: 0.8,
            }}
        >
            <path
                d="M10,25 C20,10 50,10 60,25 S90,40 100,25 S130,10 140,25"
                fill="none"
                stroke="white"
                strokeWidth="2"
            />
            {/* Simple representation of sled + reindeer */}
            <rect x="10" y="20" width="30" height="10" rx="2" fill="white" />
            <circle cx="50" cy="25" r="3" fill="white" />
            <circle cx="70" cy="25" r="3" fill="white" />
            <circle cx="90" cy="25" r="3" fill="white" />
            <circle cx="110" cy="25" r="3" fill="white" />
        </svg>
    );
};

export default SantaSilhouette;
