const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Shipment = require('../models/Shipment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order/:shipmentId
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.shipmentId);

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  if (shipment.paymentStatus === 'Paid') {
    res.status(400);
    throw new Error('Shipment is already paid');
  }

  const options = {
    amount: Math.round(shipment.cost * 100), // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_${shipment.trackingNumber}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    shipment.razorpayOrderId = order.id;
    await shipment.save();
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Razorpay order creation failed');
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shipmentId } = req.body;

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    shipment.paymentStatus = 'Paid';
    shipment.razorpayPaymentId = razorpay_payment_id;
    shipment.razorpaySignature = razorpay_signature;
    
    shipment.statusHistory.push({
        status: shipment.currentStatus,
        location: shipment.currentLocation,
        notes: `Payment successful. Reference: ${razorpay_payment_id}`,
        timestamp: new Date()
    });

    await shipment.save();
    res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid signature, payment verification failed');
  }
});

module.exports = {
  createOrder,
  verifyPayment,
};