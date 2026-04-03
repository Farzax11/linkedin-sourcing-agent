const express = require('express');
const router = express.Router();
const { searchCandidates, scoreCandidatesEndpoint } = require('../controllers/candidateController');

router.post('/search-candidates', searchCandidates);
router.post('/score-candidates', scoreCandidatesEndpoint);

module.exports = router;
