// const express = require('express');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Booking = require('../models/Booking');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // Create payment intent
// router.post('/create-payment-intent', auth, async (req, res) => {
//   try {
//     const { amount, gigId, artistId } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Convert to cents
//       currency: 'usd',
//       metadata: {
//         gigId,
//         clientId: req.user._id.toString(),
//         artistId
//       }
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Confirm payment
// router.post('/confirm-payment', auth, async (req, res) => {
//   try {
//     const { paymentIntentId, gigId, artistId, amount } = req.body;

//     const booking = new Booking({
//       gig: gigId,
//       client: req.user._id,
//       artist: artistId,
//       amount,
//       stripePaymentId: paymentIntentId,
//       paymentStatus: 'paid'
//     });

//     await booking.save();
//     res.json({ message: 'Payment confirmed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Gig = require('../models/Gig');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, gigId, artistId } = req.body;

    // Validate the gig exists and belongs to the client
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this gig' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        gigId,
        clientId: req.user._id.toString(),
        artistId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, gigId, artistId, amount } = req.body;

    // Get gig and artist details for email
    const gig = await Gig.findById(gigId).populate('client', 'name email');
    const artist = await User.findById(artistId);

    if (!gig || !artist) {
      return res.status(404).json({ message: 'Gig or artist not found' });
    }

    // Create booking record
    const booking = new Booking({
      gig: gigId,
      client: req.user._id,
      artist: artistId,
      amount,
      stripePaymentId: paymentIntentId,
      paymentStatus: 'paid'
    });

    await booking.save();

    // Update gig status
    await Gig.findByIdAndUpdate(gigId, {
      status: 'in_progress',
      selectedArtist: artistId
    });

    // Send payment confirmation email to artist
    try {
      await sendEmail(
        artist.email,
        'paymentConfirmation',
        {
          artistName: artist.name,
          amount: amount,
          gigTitle: gig.title
        }
      );
    } catch (emailError) {
      console.error('Payment confirmation email failed:', emailError);
    }

    res.json({ 
      message: 'Payment confirmed successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'client') {
      bookings = await Booking.find({ client: req.user._id })
        .populate('gig', 'title')
        .populate('artist', 'name email')
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ artist: req.user._id })
        .populate('gig', 'title')
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
