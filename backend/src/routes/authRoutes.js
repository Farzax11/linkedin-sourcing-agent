const express = require('express');
const router = express.Router();
const { register, login, getMe, saveSearchHistory } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', auth, getMe);
router.post('/auth/history', auth, saveSearchHistory);

module.exports = router;
