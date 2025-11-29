const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const appointmentController = require('../controllers/appointmentController');

// ADMIN & SCHEDULER can create appointments
router.post(
  
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'SCHEDULER'),
  appointmentController.createAppointment
);

// Get all appointments (ADMIN & SCHEDULER)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'SCHEDULER'),
  appointmentController.getAllAppointments
);

// Get appointment by ID (ADMIN, SCHEDULER, PROVIDER, PATIENT)
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'SCHEDULER', 'PROVIDER', 'PATIENT'),
  appointmentController.getAppointmentById
);

// Update appointment (ADMIN & SCHEDULER) with optimistic locking
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'SCHEDULER'),
  appointmentController.updateAppointment
);

// Delete appointment (ADMIN & SCHEDULER)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'SCHEDULER'),
  appointmentController.deleteAppointment
);

module.exports = router;
