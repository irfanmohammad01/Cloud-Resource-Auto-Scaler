/**
 * LoadingSpinner component
 * 
 * Simple loading indicator for async operations
 */

import React from 'react';

/**
 * Basic loading spinner
 * 
 * Displays centered "Loading..." text
 */
const LoadingSpinner: React.FC = () => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '20px',
            fontSize: '16px',
            color: '#666'
        }}>
            Loading...
        </div>
    );
};

export default LoadingSpinner;
