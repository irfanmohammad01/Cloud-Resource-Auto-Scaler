/**
 * Layout component
 * 
 * Provides consistent layout structure across all pages
 * Includes the global footer
 */

import React from 'react';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={styles.layoutContainer}>
            <main style={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    layoutContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    mainContent: {
        flex: '1',
    },
};

export default Layout;
