const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User management routes (ADMIN only)
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), authController.getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRoles('ADMIN'), authController.getUserById);
router.post('/users', authenticateToken, authorizeRoles('ADMIN'), authController.createUser);
router.put('/users/:id', authenticateToken, authorizeRoles('ADMIN'), authController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('ADMIN'), authController.deleteUser);

module.exports = router;
