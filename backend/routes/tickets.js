const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { auth, organizerOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/book', auth, async (req, res) => {
  try {
    const { eventId, quantity, attendeeName, attendeeEmail } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    if (event.ticketsSold + quantity > event.totalTickets) {
      return res.status(400).json({ message: 'Not enough tickets available.' });
    }
    const ticketId = `TKT-${uuidv4().slice(0, 8).toUpperCase()}`;
    const totalAmount = event.ticketPrice * quantity;
    const qrData = JSON.stringify({ ticketId, eventId, userId: req.user._id });
    const qrCode = await QRCode.toDataURL(qrData);
    const ticket = await Ticket.create({
      ticketId,
      event: eventId,
      user: req.user._id,
      quantity,
      totalAmount,
      attendeeName: attendeeName || req.user.name,
      attendeeEmail: attendeeEmail || req.user.email,
      qrCode,
      paymentStatus: event.ticketPrice === 0 ? 'completed' : 'pending',
    });
    if (event.ticketPrice === 0) {
      event.ticketsSold += quantity;
      await event.save();
    }
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/my-tickets', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event', 'title date time venue')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:ticketId', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate('event')
      .populate('user', 'name email');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/checkin', auth, organizerOnly, async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId }).populate('event');
    if (!ticket) return res.status(404).json({ message: 'Invalid ticket.' });
    if (ticket.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed.' });
    }
    if (ticket.checkedIn) {
      return res.status(400).json({
        message: 'Already checked in.',
        checkedInAt: ticket.checkedInAt,
        ticket,
      });
    }
    const event = await Event.findById(ticket.event._id);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to check in for this event.' });
    }
    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    await ticket.save();
    res.json({ message: 'Check-in successful!', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/event/:eventId', auth, organizerOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find({ event: req.params.eventId, paymentStatus: 'completed' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
