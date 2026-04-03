import React from 'react';

export default function ScoreBadge({ score }) {
  const color =
    score >= 80 ? '#22c55e' :
    score >= 60 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className="score-badge" style={{ borderColor: color, color }}>
      <span className="score-number">{score}</span>
      <span className="score-label">score</span>
    </div>
  );
}
