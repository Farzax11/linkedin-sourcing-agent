import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CandidateCard from '../components/CandidateCard';

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showTop3Only, setShowTop3Only] = useState(false);

  if (!state?.data) {
    return (
      <div className="empty-state">
        <p>No results yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Start a Search</button>
      </div>
    );
  }

  const { data, jobRole } = state;
  const allCandidates = data.all || data.candidates || [];
  const candidates = showTop3Only ? data.top3 || allCandidates.slice(0, 3) : allCandidates;

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h2 className="results-title">Results for "{jobRole}"</h2>
          <p className="results-meta">{data.totalFound} candidates found</p>
        </div>
        <div className="results-actions">
          <button
            className={`btn ${showTop3Only ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowTop3Only(!showTop3Only)}
          >
            {showTop3Only ? 'Show All' : '⭐ Top 3 Only'}
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            ← New Search
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <p>No candidates match your filters.</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Adjust Search</button>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              jobRole={jobRole}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
