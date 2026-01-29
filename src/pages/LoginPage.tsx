import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: setAuthToken, isAuthenticated } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError(null);

        // Guard against the "already logged in" edge case:
        // avoid calling /api/auth/login if we already have a valid token.
        if (isAuthenticated) {
            navigate('/instances', { replace: true });
            return;
        }

        if (!authService.isValidEmail(email) || !authService.isValidPassword(password)) {
            setError('Please enter valid email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login(email, password);
            setAuthToken(response.token);
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
