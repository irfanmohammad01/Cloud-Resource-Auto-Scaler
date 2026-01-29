/**
 * LandingPage component
 * 
 * Clean, minimal public landing page with light theme
 * Features:
 * - Full viewport hero section
 * - Feature-focused content
 * - Login/Register buttons in header
 * - Footer below the fold (appears only on scroll)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.pageContainer}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerButtons}>
                    <button
                        onClick={() => navigate('/login')}
                        style={styles.headerButton}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        style={styles.headerButton}
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* Hero section - full viewport */}
            <main style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.appName}>CloudPulse</h1>
                    <p style={styles.tagline}>
                        Monitor and scale AWS instances intelligently
                    </p>

                    {/* Feature statements */}
                    <div style={styles.features}>
                        <div style={styles.feature}>Real-time metrics monitoring</div>
                        <div style={styles.feature}>Intelligent scaling decisions</div>
                        <div style={styles.feature}>Secure instance management</div>
                    </div>
                </div>
            </main>

            {/* Footer below the fold */}
            <Footer />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafaff',
    },
    header: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '24px 40px',
        zIndex: 10,
    },
    headerButtons: {
        display: 'flex',
        gap: '16px',
    },
    headerButton: {
        padding: '10px 24px',
        backgroundColor: '#1976d2',
        color: '#ffffffff',
        border: '1px solid #000000ff',
        borderRadius: '14px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    heroSection: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        backgroundColor: '#fafafaff',
    },
    heroContent: {
        maxWidth: '800px',
        textAlign: 'center',
    },
    appName: {
        fontSize: '64px',
        fontWeight: '700',
        color: '#1976d2',
        marginBottom: '16px',
        letterSpacing: '-1.5px',
        lineHeight: '1.1',
    },
    tagline: {
        fontSize: '22px',
        color: '#313131ff',
        marginBottom: '48px',
        lineHeight: '1.5',
        fontWeight: '400',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '32px',
    },
    feature: {
        fontSize: '16px',
        color: '#666',
        padding: '12px 24px',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #7a7878ff',
        fontWeight: '500',

    },
};

export default LandingPage;
