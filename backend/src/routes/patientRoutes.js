const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const patientController = require('../controllers/patientController');

router.get('/', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER'), patientController.getAllPatients);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER', 'PATIENT'), patientController.getPatientById);

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER'), patientController.createPatient);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER'), patientController.updatePatient);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'SCHEDULER'), patientController.deletePatient);

module.exports = router;
