const express = require('express');
const userRoutes = require('./userRoutes');
//const clothingRoutes = require('./clothingRoutes');
//const outfitRoutes = require('./outfitRoutes');

function registerRoutes(app) {
  const router = express.Router();

  router.use('/users', userRoutes);
  //router.use('/clothes', clothingRoutes);
 // router.use('/outfits', outfitRoutes);

  app.use('/api', router);
}

module.exports = { registerRoutes };
