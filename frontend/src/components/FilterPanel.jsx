import React from 'react';

export default function FilterPanel({ filters, onChange }) {
  function handleSkillInput(e) {
    const skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
    onChange({ ...filters, skills });
  }

  return (
    <div className="filter-panel">
      <h4 className="filter-title">Filters</h4>

      <div className="filter-group">
        <label className="filter-label">Min Experience (years)</label>
        <input
          type="number"
          className="filter-input"
          min="0"
          max="20"
          value={filters.minExperience}
          onChange={(e) => onChange({ ...filters, minExperience: Number(e.target.value) })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Required Skills (comma-separated)</label>
        <input
          type="text"
          className="filter-input"
          placeholder="e.g. React, TypeScript"
          defaultValue={filters.skills?.join(', ')}
          onChange={handleSkillInput}
        />
      </div>
    </div>
  );
}
