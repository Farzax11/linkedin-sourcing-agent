const express = require('express');
const router = express.Router();
const { generateOutreach } = require('../controllers/messageController');

router.post('/generate-message', generateOutreach);

module.exports = router;
