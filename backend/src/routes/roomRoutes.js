const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const roomController = require('../controllers/roomController');

// ADMIN can create rooms
router.post('/', authenticateToken, authorizeRoles('ADMIN'), roomController.createRoom);

// Everyone with auth can see rooms
router.get('/', authenticateToken, roomController.getAllRooms);

// ADMIN can update rooms
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), roomController.updateRoom);

// ADMIN can delete rooms
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), roomController.deleteRoom);

module.exports = router;
