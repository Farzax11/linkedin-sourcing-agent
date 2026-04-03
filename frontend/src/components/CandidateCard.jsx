import React, { useState } from 'react';
import { generateMessage } from '../services/api';
import ScoreBadge from './ScoreBadge';
import Spinner from './Spinner';

export default function CandidateCard({ candidate, jobRole, rank }) {
  const [message, setMessage] = useState('');
  const [msgSource, setMsgSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerateMessage() {
    setLoading(true);
    setError('');
    try {
      const data = await generateMessage(candidate, jobRole);
      setMessage(data.message);
      setMsgSource(data.source);
    } catch (err) {
      setError('Failed to generate message. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`candidate-card ${rank <= 3 ? 'top-candidate' : ''}`}>
      {rank <= 3 && <div className="rank-badge">#{rank} Top Match</div>}

      <div className="card-header">
        <div className="avatar">{candidate.name.charAt(0)}</div>
        <div className="card-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-role">{candidate.currentRole} · {candidate.company}</p>
          <p className="candidate-location">📍 {candidate.location}</p>
        </div>
        <ScoreBadge score={candidate.score} />
      </div>

      <div className="card-body">
        <div className="skills-section">
          <span className="section-label">Skills</span>
          <div className="skills-list">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className={`skill-tag ${candidate.matchedSkills?.includes(skill) ? 'matched' : ''}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="score-breakdown">
          <div className="score-row">
            <span className="score-row-label">Skill Match (70%)</span>
            <div className="mini-bar">
              <div className="mini-bar-fill skill-fill" style={{ width: `${candidate.skillMatchPercent}%` }} />
            </div>
            <span className="score-row-val">{candidate.skillMatchPercent}%</span>
          </div>
          <div className="score-row">
            <span className="score-row-label">Experience (30%)</span>
            <div className="mini-bar">
              <div className="mini-bar-fill exp-fill" style={{ width: `${candidate.experienceScore}%` }} />
            </div>
            <span className="score-row-val">{candidate.experience}yr</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-primary" onClick={handleGenerateMessage} disabled={loading}>
          {loading ? <Spinner size="sm" /> : '✉️ Generate Outreach'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {message && (
        <div className="message-box">
          <div className="message-header">
            <span>
              {msgSource === 'openai' ? '🤖 AI Generated' : '📝 Template'}
            </span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
          </div>
          <p className="message-text">{message}</p>
        </div>
      )}
    </div>
  );
}
