const mongoose = require('mongoose');
const slugify = require('slugify');

const shipmentSchema = mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => Math.random().toString(36).substring(2, 10).toUpperCase(), // Generates a random 8-char string
    },
    sender: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact: { type: String, required: true },
    },
    receiver: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      contact: { type: String, required: true },
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    currentStatus: {
      type: String,
      enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed Attempt', 'Cancelled'],
      default: 'Pending',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed Attempt', 'Cancelled'],
          required: true,
        },
        location: { type: String },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
    expectedDeliveryDate: {
      type: Date,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    // Optional: link shipment to a user if created by a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Set to true if all shipments must be linked to a user
    },
    slug: String,
  },
  {
    timestamps: true,
  }
);

// Create shipment slug from tracking number
shipmentSchema.pre('save', function (next) {
  if (this.isModified('trackingNumber') || this.isNew) {
    this.slug = slugify(this.trackingNumber, { lower: true, strict: true });
  }
  next();
});

// Update status history when currentStatus changes
shipmentSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.currentStatus) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate.currentStatus !== update.$set.currentStatus) {
      update.$push = {
        statusHistory: {
          status: update.$set.currentStatus,
          location: update.$set.currentLocation || docToUpdate.statusHistory[docToUpdate.statusHistory.length -1]?.location || 'N/A',
          notes: `Status updated to ${update.$set.currentStatus}`,
          timestamp: new Date()
        }
      };
    }
  }
  next();
});


module.exports = mongoose.model('Shipment', shipmentSchema);
