const { generateMessage } = require('../services/messageService');

// POST /api/generate-message
async function generateOutreach(req, res) {
  try {
    const { candidate, jobRole } = req.body;
    if (!candidate || !jobRole) {
      return res.status(400).json({ error: 'candidate and jobRole are required' });
    }
    const message = await generateMessage(candidate, jobRole);
    const source = process.env.OPENAI_API_KEY ? 'openai' : 'template';
    res.json({ message, candidate: candidate.name, jobRole, source });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate message', details: err.message });
  }
}

module.exports = { generateOutreach };
