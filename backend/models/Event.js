const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: '' },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 1 },
    ticketsSold: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  },
  { timestamps: true }
);

eventSchema.virtual('ticketsAvailable').get(function () {
  return this.totalTickets - this.ticketsSold;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
