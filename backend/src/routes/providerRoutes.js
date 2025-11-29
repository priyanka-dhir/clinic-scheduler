const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const providerController = require('../controllers/providerController');

// Only ADMIN can create providers
router.post('/', authenticateToken, authorizeRoles('ADMIN'), providerController.createProvider);

// ADMIN,SCHEDULER and PROVIDER can see all providers
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER', 'PROVIDER'), providerController.getAllProviders);

// ADMIN, SCHEDULER, PROVIDER can get specific provider info
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER', 'PROVIDER'), providerController.getProviderById);

// Only ADMIN can update providers
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), providerController.updateProvider);

// Only ADMIN can delete providers
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), providerController.deleteProvider);

module.exports = router;
