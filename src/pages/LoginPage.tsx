/**
 * LoginPage component
 * 
 * Handles user authentication with email and password
 * On successful login, saves JWT token and redirects to instances list
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: setAuthToken } = useAuth();

    // Form state
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // UI state
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle login form submission
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            // Call login API
            const response = await authService.login(email, password);

            // Save token and update auth state
            setAuthToken(response.token);

            // Redirect to instances page
            navigate('/instances');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
                Cloud Resource Autoscaler
            </h1>

            <h2 style={{ marginBottom: '20px' }}>Login</h2>

            <ErrorMessage error={error} />

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                        placeholder="user@example.com"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                        }}
                    >
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
