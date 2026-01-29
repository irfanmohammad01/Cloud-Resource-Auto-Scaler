import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import { validatePasswordRules } from '../utils/passwordValidation';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: setAuthToken } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Live password rule state (updates instantly as the user types).
    const passwordRules = validatePasswordRules(password);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError(null);

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!authService.isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!authService.isValidPassword(password)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {

            await authService.register(email, password);

            setSuccess(true);

            const loginResponse = await authService.login(email, password);

            setAuthToken(loginResponse.token);

            navigate('/instances');
        } catch (err: any) {
            setError(err.message);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
                Cloud Resource Autoscaler
            </h1>

            <h2 style={{ marginBottom: '20px' }}>Create Account</h2>

            <ErrorMessage error={error} />

            {success && (
                <div
                    style={{
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        fontSize: '14px',
                    }}
                >
                    Registration successful! Logging you in...
                </div>
            )}

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
                        autoComplete="email"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
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
                        autoComplete="new-password"
                    />

                    <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: 1.4 }}>
                        {/* Plain + minimal: text + symbols only (no animations). */}
                        <div>Password must include:</div>
                        <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                            <li>
                                <span style={{ color: passwordRules.minLength ? 'green' : 'red' }}>
                                    {passwordRules.minLength ? '✓' : '✗'}
                                </span>{' '}
                                Minimum 8 characters
                            </li>
                            <li>
                                <span style={{ color: passwordRules.uppercase ? 'green' : 'red' }}>
                                    {passwordRules.uppercase ? '✓' : '✗'}
                                </span>{' '}
                                At least one uppercase letter
                            </li>
                            <li>
                                <span style={{ color: passwordRules.lowercase ? 'green' : 'red' }}>
                                    {passwordRules.lowercase ? '✓' : '✗'}
                                </span>{' '}
                                At least one lowercase letter
                            </li>
                            <li>
                                <span style={{ color: passwordRules.number ? 'green' : 'red' }}>
                                    {passwordRules.number ? '✓' : '✗'}
                                </span>{' '}
                                At least one number
                            </li>
                            <li>
                                <span style={{ color: passwordRules.special ? 'green' : 'red' }}>
                                    {passwordRules.special ? '✓' : '✗'}
                                </span>{' '}
                                At least one special character
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
                        Confirm Password:
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
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
                        marginBottom: '15px',
                    }}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '14px' }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                        }}
                    >
                        Login here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
