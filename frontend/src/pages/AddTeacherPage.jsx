import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/api';

const CURRENT_YEAR = new Date().getFullYear();

const AddTeacherPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    university_name: '',
    gender: '',
    year_joined: '',
    subject: '',
    bio: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError]       = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    setSuccess('');

    try {
      const res = await teacherService.create(form);
      setSuccess(
        `Teacher "${res.data.data.user.first_name} ${res.data.data.user.last_name}" created successfully!`
      );
      setForm({
        first_name: '', last_name: '', email: '', password: '', phone: '',
        university_name: '', gender: '', year_joined: '', subject: '', bio: '',
      });
      setTimeout(() => navigate('/teachers'), 1800);
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(backendErrors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        );
      } else {
        setApiError(err.response?.data?.message || 'Failed to add teacher. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fe = (name) =>
    fieldErrors[name] ? (
      <span style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 4, display: 'block' }}>
        {fieldErrors[name]}
      </span>
    ) : null;

  return (
    <div className="main-content">
      <div className="container">
        <div className="table-page-header fade-in">
          <div>
            <h1>Add <span>Teacher</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              Creates both a user account and teacher profile in one operation
            </p>
          </div>
        </div>

        {apiError && <div className="alert alert-error fade-in"><span>⚠</span> {apiError}</div>}
        {success  && <div className="alert alert-success fade-in"><span>✓</span> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card fade-in" style={{ marginBottom: 24 }}>
            <h3 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-gold)',
              marginBottom: 24,
            }}>
              01 — User Account
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>First name *</label>
                <input name="first_name" type="text" placeholder="Lucky" value={form.first_name} onChange={handleChange} />
                {fe('first_name')}
              </div>
              <div className="form-group">
                <label>Last name *</label>
                <input name="last_name" type="text" placeholder="Sharma" value={form.last_name} onChange={handleChange} />
                {fe('last_name')}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email address *</label>
                <input name="email" type="email" placeholder="lucky@university.edu" value={form.email} onChange={handleChange} />
                {fe('email')}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: 320 }}>
              <label>Password *</label>
              <input name="password" type="password" placeholder="min. 6 characters" value={form.password} onChange={handleChange} />
              {fe('password')}
            </div>
          </div>

          <div className="card fade-in fade-in-delay-1" style={{ marginBottom: 32 }}>
            <h3 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-gold)',
              marginBottom: 24,
            }}>
              02 — Teacher Profile
            </h3>

            <div className="form-group">
              <label>University name *</label>
              <input name="university_name" type="text" placeholder="Delhi University" value={form.university_name} onChange={handleChange} />
              {fe('university_name')}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {fe('gender')}
              </div>
              <div className="form-group">
                <label>Year joined *</label>
                <input
                  name="year_joined"
                  type="number"
                  min="1900"
                  max={CURRENT_YEAR}
                  placeholder={String(CURRENT_YEAR)}
                  value={form.year_joined}
                  onChange={handleChange}
                />
                {fe('year_joined')}
              </div>
            </div>

            <div className="form-group">
              <label>Subject / Department</label>
              <input name="subject" type="text" placeholder="Computer Science" value={form.subject} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                placeholder="A short biography about the teacher…"
                value={form.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="fade-in fade-in-delay-2" style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Create Teacher →'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/teachers')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherPage;
