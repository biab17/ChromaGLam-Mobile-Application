const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authMiddleware } = require('../../config/auth'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 1. Adăugare haină
router.post('/add', authMiddleware, upload.single('image'), itemController.addItem);

// 2. Afișare toate hainele userului
router.get('/', authMiddleware, itemController.getUserItems);

// 3. Schimbare manuală status (AVAILABLE <-> UNAVAILABLE)
router.patch('/:id/toggle', authMiddleware, itemController.toggleAvailability);

// 4. REPARAT: Aduce hainele pentru validare (3 zile) - O singură rută, nume corect
router.get('/validate', authMiddleware, itemController.getItemsToValidate);

// 5. REPARAT: Trece haina înapoi pe AVAILABLE din căsuța de pe Home
router.patch('/:id/available', authMiddleware, itemController.makeItemsAvailable);

module.exports = router;