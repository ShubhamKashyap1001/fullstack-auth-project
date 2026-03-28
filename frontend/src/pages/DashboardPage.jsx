import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService, teacherService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, teachers: 0 });
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, teachersRes] = await Promise.all([
          userService.getAll(),
          teacherService.getAll(),
        ]);
        setStats({
          users:    usersRes.data.count   || 0,
          teachers: teachersRes.data.count || 0,
        });
        setRecentTeachers((teachersRes.data.data || []).slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const genderBadge = (g) => {
    const cls = { male: 'badge-male', female: 'badge-female', other: 'badge-other' };
    return <span className={`badge ${cls[g] || ''}`}>{g}</span>;
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="dashboard-header fade-in">
          <h1>
            Good day,{' '}
            <em>{user?.first_name}.</em>
          </h1>
          <p>Here's an overview of your TeachPortal data.</p>
        </div>

        {loading ? (
          <Spinner text="Fetching data…" />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            <div className="stats-grid fade-in fade-in-delay-1">
              <div className="stat-card">
                <div className="stat-card-label">Total Users</div>
                <div className="stat-card-value">{stats.users}</div>
                <div className="stat-card-sub">registered administrators</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Total Teachers</div>
                <div className="stat-card-value">{stats.teachers}</div>
                <div className="stat-card-sub">across all universities</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Your Account</div>
                <div className="stat-card-value" style={{ fontSize: 28, paddingTop: 12 }}>
                  {user?.email}
                </div>
                <div className="stat-card-sub">logged in</div>
              </div>
            </div>

            <div className="fade-in fade-in-delay-2" style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
              <Link to="/add-teacher" className="btn btn-primary">+ Add Teacher</Link>
              <Link to="/teachers"    className="btn btn-ghost">View Teachers</Link>
              <Link to="/users"       className="btn btn-ghost">View Users</Link>
            </div>

            <div className="fade-in fade-in-delay-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 24, color: 'var(--text-primary)' }}>
                  Recent Teachers
                </h2>
                <Link to="/teachers" style={{ fontSize: 13, color: 'var(--text-gold)' }}>View all →</Link>
              </div>

              {recentTeachers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🎓</div>
                  <h3>No teachers yet</h3>
                  <p>Add your first teacher to see them here.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>University</th>
                        <th>Subject</th>
                        <th>Gender</th>
                        <th>Year Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTeachers.map((t) => (
                        <tr key={t.id}>
                          <td className="cell-id">{t.id}</td>
                          <td>
                            <strong>{t.first_name} {t.last_name}</strong>
                            <br />
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.email}</span>
                          </td>
                          <td>{t.university_name}</td>
                          <td>{t.subject || '—'}</td>
                          <td>{genderBadge(t.gender)}</td>
                          <td>{t.year_joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
