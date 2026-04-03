const express = require('express');
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getMyShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  assignDriver,
  getDriverShipments,
} = require('../controllers/shipmentController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const driver = require('../middleware/driverMiddleware');

// User and Admin access
router.route('/').post(protect, createShipment);
router.route('/my').get(protect, getMyShipments); // Get shipments specific to the authenticated user

// Admin only routes
router.route('/admin').get(protect, admin, getAllShipments); // Get all shipments for admin
router.route('/driver/my').get(protect, driver, getDriverShipments);
router.route('/:id/assign').put(protect, admin, assignDriver);
router
  .route('/:id')
  .get(protect, getShipmentById)
  .put(protect, updateShipment) // Logic inside controller handles role-based restriction
  .delete(protect, admin, deleteShipment);

module.exports = router;
