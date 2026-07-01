const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentId: { type: String, default: '' },
    qrCode: { type: String, default: '' },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
