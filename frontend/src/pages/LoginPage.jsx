import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(form);
      const { user, token } = res.data;
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-tag">TeachPortal v1.0</div>
        <h1>
          Welcome<br />
          <em>back.</em>
        </h1>
        <p>
          Manage your academic staff, track university affiliations,
          and streamline teacher onboarding — all in one place.
        </p>
        <div className="auth-hero-number">01</div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-header fade-in">
          <h2>Sign in</h2>
          <p>Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="alert alert-error fade-in">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="fade-in fade-in-delay-1">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <div className="divider-text fade-in fade-in-delay-2">or</div>

        <p className="fade-in fade-in-delay-2" style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--text-gold)' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
