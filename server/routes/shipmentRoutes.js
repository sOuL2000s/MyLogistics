const express = require('express');
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getMyShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require('../controllers/shipmentController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// User and Admin access
router.route('/').post(protect, createShipment);
router.route('/my').get(protect, getMyShipments); // Get shipments specific to the authenticated user

// Admin only routes
router.route('/admin').get(protect, admin, getAllShipments); // Get all shipments for admin
router
  .route('/:id')
  .get(protect, getShipmentById) // User can view their own, Admin can view all
  .put(protect, admin, updateShipment) // Admin can update, users might have restricted updates
  .delete(protect, admin, deleteShipment); // Admin can delete

module.exports = router;
