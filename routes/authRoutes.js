const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
const loginLimiter = require('../middleware/rateLimiter');
router.post('/login', loginLimiter, login);

module.exports = router;