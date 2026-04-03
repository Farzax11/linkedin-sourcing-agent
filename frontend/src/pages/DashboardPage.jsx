import React from 'react';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { history, clearHistory } = useSearchHistory();
  const navigate = useNavigate();

  const totalSearches = history.length;
  const avgResults = totalSearches
    ? Math.round(history.reduce((sum, h) => sum + (h.resultCount || 0), 0) / totalSearches)
    : 0;
  const topRole = history.length
    ? history.reduce((acc, h) => {
        acc[h.jobRole] = (acc[h.jobRole] || 0) + 1;
        return acc;
      }, {})
    : {};
  const mostSearched = Object.entries(topRole).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🔍</span>
          <span className="stat-value">{totalSearches}</span>
          <span className="stat-label">Total Searches</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{avgResults}</span>
          <span className="stat-label">Avg Candidates / Search</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-value" style={{ fontSize: '1rem' }}>{mostSearched}</span>
          <span className="stat-label">Most Searched Role</span>
        </div>
      </div>

      <div className="history-table-section">
        <div className="section-header">
          <h3 className="section-title">Search History</h3>
          {history.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={clearHistory}>Clear All</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <p>No searches yet. Start sourcing candidates!</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Search Now</button>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Candidates Found</th>
                <th>Min Experience</th>
                <th>Skills Filter</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i}>
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => navigate('/', { state: { prefill: item.jobRole } })}
                    >
                      {item.jobRole}
                    </button>
                  </td>
                  <td>{item.resultCount ?? '—'}</td>
                  <td>{item.filters?.minExperience ?? 0}+ yrs</td>
                  <td>{item.filters?.skills?.join(', ') || '—'}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
