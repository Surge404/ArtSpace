const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  stripePaymentId: String,
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);