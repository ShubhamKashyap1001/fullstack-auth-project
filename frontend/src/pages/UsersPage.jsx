import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import Spinner from '../components/Spinner';

const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    userService
      .getAll()
      .then((res) => setUsers(res.data.data || []))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="main-content">
      <div className="container">
        <div className="table-page-header fade-in">
          <div>
            <h1>Auth <span>Users</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              All registered administrator accounts
            </p>
          </div>
          <span className="table-meta">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="fade-in fade-in-delay-1" style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420 }}
          />
        </div>

        {loading ? (
          <Spinner text="Loading users…" />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state-icon">👤</div>
            <h3>No users found</h3>
            <p>{search ? 'Try a different search term.' : 'No users have been registered yet.'}</p>
          </div>
        ) : (
          <div className="table-container fade-in fade-in-delay-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-id">{u.id}</td>
                    <td>
                      <strong>{u.first_name} {u.last_name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-gold)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {u.email}
                    </td>
                    <td>{u.phone || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatDate(u.created_at)}</td>
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

export default UsersPage;
