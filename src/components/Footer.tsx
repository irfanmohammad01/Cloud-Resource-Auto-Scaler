/**
 * Footer component
 * 
 * Global footer displayed across all pages
 * Contains app info, links, and contact information
 */

import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Left section: Branding */}
                <div style={styles.section}>
                    <div style={styles.brandName}>CloudPulse</div>
                    <div style={styles.description}>
                        Monitor and scale AWS instances intelligently
                    </div>
                </div>

                {/* Center section: Navigation Links */}
                <nav style={styles.section}>
                    <div style={styles.linksTitle}>Resources</div>
                    <div style={styles.linkGroup}>
                        <a href="https://github.com/avirajkale50-pro/cloud-autoscaler-backend" style={styles.link} target="_blank" rel="noopener noreferrer">
                            Docs
                        </a>
                        <a href="https://example.com/privacy" style={styles.link} target="_blank" rel="noopener noreferrer">
                            Privacy
                        </a>
                        <a href="https://example.com/terms" style={styles.link} target="_blank" rel="noopener noreferrer">
                            Terms
                        </a>
                    </div>
                </nav>

                {/* Right section: Social Links & Contact */}
                <div style={styles.section}>
                    <div style={styles.linksTitle}>Connect</div>
                    <div style={styles.linkGroup}>
                        <a href="https://github.com/irfanmohammad01" style={styles.link} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/imirfanmohammad/" style={styles.link} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                        </a>
                        <a href="https://x.com/GeeksJourney" style={styles.link} target="_blank" rel="noopener noreferrer">
                            Twitter
                        </a>
                    </div>
                    <div style={styles.support}>
                        Support: <a href="mailto:irfan.mohammad@joshsoftware.com" style={styles.emailLink}>irfan.mohammad@joshsoftware.com</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={styles.copyright}>
                © {currentYear} CloudPulse. All rights reserved.
            </div>
        </footer>
    );
};

// Inline styles for simplicity and self-containment
const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        backgroundColor: '#ffffffff',
        borderTop: '1px solid #000000ff',
        padding: '32px 20px 20px',
        marginTop: '60px',
        color: '#666',
        fontSize: '14px',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px',
        marginBottom: '24px',
    },
    section: {
        flex: '1 1 200px',
        minWidth: '180px',
    },
    brandName: {
        fontWeight: '600',
        fontSize: '16px',
        color: '#333',
        marginBottom: '6px',
    },
    description: {
        fontSize: '13px',
        color: '#777',
        lineHeight: '1.5',
    },
    linksTitle: {
        fontWeight: '600',
        fontSize: '13px',
        color: '#555',
        marginBottom: '10px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    linkGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },
    link: {
        color: '#666',
        textDecoration: 'none',
        fontSize: '13px',
        transition: 'color 0.2s',
    },
    emailLink: {
        color: '#1976d2',
        textDecoration: 'none',
    },
    support: {
        marginTop: '12px',
        fontSize: '13px',
        color: '#777',
    },
    copyright: {
        textAlign: 'center' as const,
        fontSize: '12px',
        color: '#999',
        paddingTop: '20px',
        borderTop: '1px solid #000000ff',
        maxWidth: '1200px',
        margin: '0 auto',
    },
};

export default Footer;
