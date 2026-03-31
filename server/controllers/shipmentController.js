const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const User = require('../models/User'); // Required for admin user management

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private (Admin or Authenticated User)
const createShipment = asyncHandler(async (req, res) => {
  const {
    sender,
    receiver,
    origin,
    destination,
    itemDescription,
    weight,
    dimensions,
    expectedDeliveryDate,
    cost,
    userId, // Optional: if an admin creates a shipment for a specific user
  } = req.body;

  // Enhanced validation
  if (
    !sender?.name || !sender?.address || !sender?.contact ||
    !receiver?.name || !receiver?.address || !receiver?.contact ||
    !origin || !destination || !itemDescription ||
    !weight || !dimensions?.length || !dimensions?.width || !dimensions?.height ||
    !expectedDeliveryDate || !cost
  ) {
    res.status(400);
    throw new Error('Please fill all required fields for the shipment, including full sender/receiver details and dimensions.');
  }

  // Set initial status history
  const statusHistory = [
    {
      status: 'Pending',
      location: origin,
      notes: 'Shipment created and awaiting processing.',
      timestamp: new Date(),
    },
  ];

  const shipmentData = {
    sender,
    receiver,
    origin,
    destination,
    itemDescription,
    weight,
    dimensions,
    currentStatus: 'Pending',
    currentLocation: origin, // Set initial current location
    statusHistory,
    expectedDeliveryDate,
    cost,
  };

  // If a userId is provided (e.g., by an admin), link the shipment to that user
  // Otherwise, link to the authenticated user creating it, or leave unlinked if an admin is creating a general shipment.
  if (userId && req.user.role === 'admin') {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User specified for shipment not found.');
    }
    shipmentData.user = userId;
  } else if (req.user && req.user.role === 'user') {
    shipmentData.user = req.user._id;
  }

  const shipment = await Shipment.create(shipmentData);

  res.status(201).json(shipment);
});

// @desc    Get all shipments (Admin only)
// @route   GET /api/shipments/admin
// @access  Private/Admin
const getAllShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({}).populate('user', 'name email'); // Populate sender user details
  res.status(200).json(shipments);
});

// @desc    Get user-specific shipments
// @route   GET /api/shipments/my
// @access  Private
const getMyShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({ user: req.user._id });
  res.status(200).json(shipments);
});

// @desc    Get single shipment by ID
// @route   GET /api/shipments/:id
// @access  Private (Owner or Admin)
const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate('user', 'name email');

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  // Check if user is admin or the owner of the shipment
  if (req.user.role === 'admin' || (shipment.user && shipment.user._id.toString() === req.user._id.toString())) {
    res.status(200).json(shipment);
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized to view this shipment');
  }
});

// @desc    Update shipment details (Admin only, or restricted fields for owner)
// @route   PUT /api/shipments/:id
// @access  Private/Admin
const updateShipment = asyncHandler(async (req, res) => {
  const {
    sender,
    receiver,
    origin,
    destination,
    itemDescription,
    weight,
    dimensions,
    currentStatus, // Can be updated by admin
    expectedDeliveryDate,
    cost,
    location, // New: for status update location
    notes, // New: for status update notes
  } = req.body;

  let shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  // Only admin can update most fields or change status
  if (req.user.role === 'admin') {
    shipment.sender = sender || shipment.sender;
    shipment.receiver = receiver || shipment.receiver;
    shipment.origin = origin || shipment.origin;
    shipment.destination = destination || shipment.destination;
    shipment.itemDescription = itemDescription || shipment.itemDescription;
    shipment.weight = weight || shipment.weight;
    shipment.dimensions = dimensions || shipment.dimensions;
    shipment.expectedDeliveryDate = expectedDeliveryDate || shipment.expectedDeliveryDate;
    shipment.cost = cost || shipment.cost;
    shipment.currentLocation = location || shipment.currentLocation; // Admin can update current location directly

    if (currentStatus && shipment.currentStatus !== currentStatus) {
      shipment.currentStatus = currentStatus;
      shipment.statusHistory.push({
        status: currentStatus,
        location: location || shipment.currentLocation, // Use provided location or shipment's current
        notes: notes || `Status updated to ${currentStatus}`,
        timestamp: new Date(),
      });
    }
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized to update this shipment');
  }

  const updatedShipment = await shipment.save();
  res.status(200).json(updatedShipment);
});

// @desc    Delete shipment (Admin only)
// @route   DELETE /api/shipments/:id
// @access  Private/Admin
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this shipment');
  }

  await Shipment.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Shipment removed' });
});

// @desc    Get public tracking information by tracking number
// @route   GET /api/track/:trackingNumber
// @access  Public
const getPublicTracking = asyncHandler(async (req, res) => {
  const { trackingNumber } = req.params;
  const shipment = await Shipment.findOne({ trackingNumber });

  if (!shipment) {
    res.status(404);
    throw new Error('Tracking number not found');
  }

  // Only return necessary public information
  res.status(200).json({
    trackingNumber: shipment.trackingNumber,
    currentStatus: shipment.currentStatus,
    origin: shipment.origin,
    destination: shipment.destination,
    expectedDeliveryDate: shipment.expectedDeliveryDate,
    statusHistory: shipment.statusHistory.map(history => ({
      status: history.status,
      location: history.location,
      timestamp: history.timestamp,
      notes: history.notes,
    })),
    // Optionally include receiver name for verification, but only first name or masked
    receiverName: shipment.receiver.name.split(' ')[0], // Only first name
  });
});

module.exports = {
  createShipment,
  getAllShipments,
  getMyShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  getPublicTracking,
};
