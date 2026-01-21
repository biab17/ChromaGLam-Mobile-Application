const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const {authMiddleware} = require('../../config/auth');

router.post('/', authMiddleware, preferenceController.saveOrUpdatePreferences);
module.exports = router;