/**
 * ErrorMessage component
 * 
 * Displays error messages consistently across the app
 */

import React from 'react';

interface ErrorMessageProps {
    error: string | null;
}

/**
 * Simple error message display
 * 
 * Shows error in red text when error exists
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div style={{
            color: '#d32f2f',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #d32f2f',
            borderRadius: '4px',
            backgroundColor: '#ffebee'
        }}>
            {error}
        </div>
    );
};

export default ErrorMessage;
