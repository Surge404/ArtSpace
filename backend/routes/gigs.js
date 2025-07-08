const express = require('express');
const Gig = require('../models/Gig');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'open' })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gig
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create gigs' });
    }

    const gig = new Gig({
      ...req.body,
      client: req.user._id
    });
    
    await gig.save();
    await gig.populate('client', 'name email');
    
    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply to gig
const { sendEmail } = require('../config/email');

// Update the apply route - replace the existing one
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can apply to gigs' });
    }

    const gig = await Gig.findById(req.params.id).populate('client', 'name email');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if already applied
    const alreadyApplied = gig.applications.some(app => 
      app.artist.toString() === req.user._id.toString()
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this gig' });
    }

    gig.applications.push({
      artist: req.user._id,
      proposal: req.body.proposal
    });
    
    await gig.save();

    // Send notification email to client
    try {
      await sendEmail(
        gig.client.email,
        'gigApplication',
        {
          clientName: gig.client.name,
          gigTitle: gig.title,
          artistName: req.user.name
        }
      );
    } catch (emailError) {
      console.error('Application notification email failed:', emailError);
    }

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get client's posted gigs
router.get('/my-gigs', auth, async (req, res) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can view their gigs' });
      }
  
      const gigs = await Gig.find({ client: req.user._id })
        .populate('applications.artist', 'name email')
        .sort({ createdAt: -1 });
      
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get artist's applications
  router.get('/my-applications', auth, async (req, res) => {
    try {
      if (req.user.role !== 'artist') {
        return res.status(403).json({ message: 'Only artists can view their applications' });
      }
  
      const gigs = await Gig.find({ 'applications.artist': req.user._id })
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
      
      const applications = [];
      gigs.forEach(gig => {
        const userApplication = gig.applications.find(app => 
          app.artist.toString() === req.user._id.toString()
        );
        if (userApplication) {
          applications.push({
            _id: userApplication._id,
            gig: {
              _id: gig._id,
              title: gig.title,
              budget: gig.budget,
              client: gig.client
            },
            proposal: userApplication.proposal,
            appliedAt: userApplication.appliedAt
          });
        }
      });
      
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;