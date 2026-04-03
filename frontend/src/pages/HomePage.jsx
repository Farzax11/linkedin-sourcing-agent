import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCandidates } from '../services/api';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useAuth } from '../context/AuthContext';
import FilterPanel from '../components/FilterPanel';
import Spinner from '../components/Spinner';

const SUGGESTED_ROLES = [
  'Frontend Developer', 'Backend Engineer', 'Full Stack Developer',
  'React Developer', 'DevOps Engineer', 'Mobile Developer'
];

export default function HomePage() {
  const navigate = useNavigate();
  const { history, addSearch } = useSearchHistory();
  const { saveHistory } = useAuth();
  const [jobRole, setJobRole] = useState('');
  const [filters, setFilters] = useState({ minExperience: 0, skills: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pipeline, setPipeline] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!jobRole.trim()) return;
    setLoading(true);
    setError('');
    setPipeline(null);
    try {
      const data = await searchCandidates({ jobRole, ...filters });
      const entry = { jobRole, filters, resultCount: data.totalFound };
      addSearch(entry);
      saveHistory(entry);
      setPipeline(data.pipeline);
      setTimeout(() => navigate('/results', { state: { data, jobRole, filters } }), data.pipeline ? 900 : 0);
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?');
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-icon">🤖</div>
        <h1 className="hero-title">AI LinkedIn Sourcing Agent</h1>
        <p className="hero-subtitle">Multi-agent pipeline · OpenAI outreach · Real-time scoring</p>
      </div>

      <div className="search-card">
        <form onSubmit={handleSearch}>
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Enter a job role (e.g. Frontend Developer)"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={loading}
            />
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading || !jobRole.trim()}>
              {loading ? <Spinner size="sm" /> : 'Search'}
            </button>
          </div>

          <div className="suggestions">
            {SUGGESTED_ROLES.map((role) => (
              <button key={role} type="button" className="suggestion-chip" onClick={() => setJobRole(role)}>
                {role}
              </button>
            ))}
          </div>

          <FilterPanel filters={filters} onChange={setFilters} />
          {error && <p className="error-text">{error}</p>}
        </form>

        {pipeline && (
          <div className="pipeline-trace">
            <p className="pipeline-title">🔄 Agent Pipeline</p>
            <div className="pipeline-steps">
              {pipeline.map((step, i) => (
                <div key={i} className="pipeline-step">
                  <span className="step-dot" />
                  <span className="step-name">{step.agent}</span>
                  <span className="step-count">{step.count} candidates</span>
                  <span className="step-status">✓</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <h3 className="section-title">Recent Searches</h3>
          <div className="history-list">
            {history.slice(0, 5).map((item, i) => (
              <button key={i} className="history-item" onClick={() => setJobRole(item.jobRole)}>
                <span className="history-role">{item.jobRole}</span>
                <span className="history-meta">{item.resultCount} candidates · {new Date(item.timestamp).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
