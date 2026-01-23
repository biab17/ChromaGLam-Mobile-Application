const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');
const { authMiddleware } = require('../../config/auth'); 

router.post('/', authMiddleware, outfitController.getOutfitSuggestions);

module.exports = router;