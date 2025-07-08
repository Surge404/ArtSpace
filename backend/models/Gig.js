const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
  applications: [{
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proposal: String,
    appliedAt: { type: Date, default: Date.now }
  }],
  selectedArtist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);