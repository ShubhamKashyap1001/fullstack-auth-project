import React, { useEffect, useState } from 'react';
import { teacherService } from '../services/api';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    teacherService
      .getAll()
      .then((res) => setTeachers(res.data.data || []))
      .catch(() => setError('Failed to load teachers.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
      t.university_name?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q);
    const matchGender = !genderFilter || t.gender === genderFilter;
    return matchSearch && matchGender;
  });

  const genderBadge = (g) => {
    const cls = { male: 'badge-male', female: 'badge-female', other: 'badge-other' };
    return <span className={`badge ${cls[g] || ''}`}>{g}</span>;
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="main-content">
      <div className="container">
        <div className="table-page-header fade-in">
          <div>
            <h1>Teacher <span>Registry</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              All teacher profiles with university affiliations
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="table-meta">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
            <Link to="/add-teacher" className="btn btn-primary btn-sm">+ Add Teacher</Link>
          </div>
        </div>

        <div className="fade-in fade-in-delay-1" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name, university, subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1', minWidth: 200, maxWidth: 400 }}
          />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="">All genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading ? (
          <Spinner text="Loading teachers…" />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state-icon">🎓</div>
            <h3>No teachers found</h3>
            <p>
              {search || genderFilter
                ? 'Try adjusting your filters.'
                : 'No teachers have been added yet.'}
            </p>
            <Link to="/add-teacher" className="btn btn-primary" style={{ marginTop: 20 }}>
              + Add First Teacher
            </Link>
          </div>
        ) : (
          <div className="table-container fade-in fade-in-delay-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Teacher</th>
                  <th>University</th>
                  <th>Subject</th>
                  <th>Gender</th>
                  <th>Year Joined</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="cell-id">{t.id}</td>
                    <td>
                      <strong>{t.first_name} {t.last_name}</strong>
                      <br />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {t.email}
                      </span>
                    </td>
                    <td>{t.university_name}</td>
                    <td>{t.subject || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td>{genderBadge(t.gender)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{t.year_joined}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatDate(t.teacher_created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
