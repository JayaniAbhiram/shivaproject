const express = require('express');
const Stripe = require('stripe');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe')) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post('/create-checkout', auth, async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId }).populate('event');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    if (ticket.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Already paid.' });
    }
    const stripe = getStripe();
    if (!stripe) {
      ticket.paymentStatus = 'completed';
      ticket.paymentId = `demo_${Date.now()}`;
      await ticket.save();
      const event = await Event.findById(ticket.event._id);
      event.ticketsSold += ticket.quantity;
      await event.save();
      return res.json({ demo: true, message: 'Demo payment completed.', ticket });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: ticket.event.title,
              description: `${ticket.quantity} ticket(s) for ${ticket.event.title}`,
            },
            unit_amount: Math.round(ticket.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?ticketId=${ticket.ticketId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?ticketId=${ticket.ticketId}`,
      metadata: { ticketId: ticket.ticketId },
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    if (ticket.paymentStatus === 'completed') {
      return res.json({ ticket, message: 'Payment already verified.' });
    }
    const stripe = getStripe();
    if (!stripe) {
      ticket.paymentStatus = 'completed';
      ticket.paymentId = `demo_${Date.now()}`;
      await ticket.save();
      const event = await Event.findById(ticket.event);
      event.ticketsSold += ticket.quantity;
      await event.save();
      return res.json({ ticket, demo: true });
    }
    res.json({ ticket, message: 'Awaiting Stripe webhook confirmation.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/demo-pay', auth, async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    if (ticket.paymentStatus === 'completed') {
      return res.json({ ticket, message: 'Already paid.' });
    }
    ticket.paymentStatus = 'completed';
    ticket.paymentId = `demo_${Date.now()}`;
    await ticket.save();
    const event = await Event.findById(ticket.event);
    event.ticketsSold += ticket.quantity;
    await event.save();
    res.json({ ticket, message: 'Demo payment successful!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
