import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        <div className="navbar-brand-icon">T</div>
        <span className="navbar-brand-name">TeachPortal</span>
      </NavLink>

      <div className="navbar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Users
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          Teachers
        </NavLink>
        <NavLink
          to="/add-teacher"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          + Add Teacher
        </NavLink>
      </div>

      <div className="nav-user">
        <span className="nav-user-name">
          {user?.first_name} {user?.last_name}
        </span>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
