const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authMiddleware } = require('../../config/auth'); 
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', authMiddleware, upload.single('image'), itemController.addItem);
router.get('/', authMiddleware, itemController.getUserItems);
router.patch('/:id/toggle', authMiddleware, itemController.toggleAvailability);

module.exports = router;