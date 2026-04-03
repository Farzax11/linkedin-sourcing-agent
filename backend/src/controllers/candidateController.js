const allCandidates = require('../data/candidates');
const { runPipeline } = require('../services/scoringService');

// POST /api/search-candidates
function searchCandidates(req, res) {
  try {
    const { jobRole, skills = [], minExperience = 0 } = req.body;
    if (!jobRole) return res.status(400).json({ error: 'jobRole is required' });

    const result = runPipeline(allCandidates, jobRole, { skills, minExperience }, minExperience || 3);
    res.json({ jobRole, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

// POST /api/score-candidates
function scoreCandidatesEndpoint(req, res) {
  try {
    const { jobRole, candidates, desiredExperience = 3, skills = [] } = req.body;
    if (!jobRole || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'jobRole and candidates array required' });
    }
    const result = runPipeline(candidates, jobRole, { skills, minExperience: 0 }, desiredExperience);
    res.json({ jobRole, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
}

module.exports = { searchCandidates, scoreCandidatesEndpoint };
