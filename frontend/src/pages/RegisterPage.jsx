import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim())  errs.last_name  = 'Last name is required';
    if (!form.email.trim())      errs.email       = 'Email is required';
    if (form.password.length < 6) errs.password   = 'Minimum 6 characters';
    if (form.password !== form.confirm_password)
      errs.confirm_password = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      await authService.register({
        first_name: form.first_name,
        last_name:  form.last_name,
        email:      form.email,
        password:   form.password,
        phone:      form.phone,
      });

      const loginRes = await authService.login({
        email:    form.email,
        password: form.password,
      });

      const { user, token } = loginRes.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(backendErrors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        );
      } else {
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name) =>
    errors[name] ? (
      <span style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 4, display: 'block' }}>
        {errors[name]}
      </span>
    ) : null;

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-tag">TeachPortal v1.0</div>
        <h1>
          Join the<br />
          <em>network.</em>
        </h1>
        <p>
          Create your administrator account to start managing
          teacher profiles and university data.
        </p>
        <div className="auth-hero-number">02</div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-header fade-in">
          <h2>Create account</h2>
          <p>Fill in your details to get started</p>
        </div>

        {apiError && (
          <div className="alert alert-error fade-in">
            <span>⚠</span> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="fade-in fade-in-delay-1">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Ravi"
                value={form.first_name}
                onChange={handleChange}
              />
              {fieldError('first_name')}
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Sharma"
                value={form.last_name}
                onChange={handleChange}
              />
              {fieldError('last_name')}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ravi@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {fieldError('email')}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              {fieldError('password')}
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="repeat password"
                value={form.confirm_password}
                onChange={handleChange}
              />
              {fieldError('confirm_password')}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <div className="divider-text fade-in fade-in-delay-2">or</div>

        <p className="fade-in fade-in-delay-2" style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text-gold)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
