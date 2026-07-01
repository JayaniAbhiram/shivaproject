const express = require('express');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { auth, organizerOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, organizerOnly, async (req, res) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizer: organizerId });
    const eventIds = events.map((e) => e._id);

    const tickets = await Ticket.find({ event: { $in: eventIds }, paymentStatus: 'completed' });
    const totalRevenue = tickets.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalTicketsSold = tickets.reduce((sum, t) => sum + t.quantity, 0);
    const totalCheckIns = tickets.filter((t) => t.checkedIn).length;

    const eventsByCategory = {};
    events.forEach((e) => {
      eventsByCategory[e.category] = (eventsByCategory[e.category] || 0) + 1;
    });

    const revenueByEvent = await Promise.all(
      events.map(async (event) => {
        const eventTickets = await Ticket.find({ event: event._id, paymentStatus: 'completed' });
        return {
          eventId: event._id,
          title: event.title,
          revenue: eventTickets.reduce((sum, t) => sum + t.totalAmount, 0),
          ticketsSold: eventTickets.reduce((sum, t) => sum + t.quantity, 0),
          checkIns: eventTickets.filter((t) => t.checkedIn).length,
        };
      })
    );

    const recentBookings = await Ticket.find({ event: { $in: eventIds }, paymentStatus: 'completed' })
      .populate('event', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      summary: {
        totalEvents: events.length,
        totalRevenue,
        totalTicketsSold,
        totalCheckIns,
        upcomingEvents: events.filter((e) => e.status === 'upcoming').length,
      },
      eventsByCategory,
      revenueByEvent,
      recentBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/overview', auth, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments({ paymentStatus: 'completed' });
    const totalRevenue = await Ticket.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    res.json({
      totalEvents,
      totalUsers,
      totalTickets,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
