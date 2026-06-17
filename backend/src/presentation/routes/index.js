const express = require('express');
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const preferenceRoutes = require('./preferenceRoutes');
const outfitRoutes = require('./outfitRoutes');
const { authenticateToken } = require('../../config/auth');
const { getDashboardData } = require('../controllers/userController');

function registerRoutes(app) {
  const router = express.Router();

  router.use('/users', userRoutes);
  router.use('/items', itemRoutes);
  router.use('/preferences', preferenceRoutes);
  router.use('/outfits', outfitRoutes);
  router.use('/items', itemRoutes);

  app.use('/api', router);
}

module.exports = { registerRoutes };
