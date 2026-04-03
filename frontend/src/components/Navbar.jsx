import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🔍</span>
        <span className="brand-name">Sourcing Agent</span>
      </div>

      {user && (
        <div className="navbar-links">
          <Link className={`nav-link ${pathname === '/' ? 'active' : ''}`} to="/">Search</Link>
          <Link className={`nav-link ${pathname === '/results' ? 'active' : ''}`} to="/results">Results</Link>
          <Link className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
        </div>
      )}

      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name?.split(' ')[0]}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline btn-sm" to="/login">Sign In</Link>
            <Link className="btn btn-primary btn-sm" to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
