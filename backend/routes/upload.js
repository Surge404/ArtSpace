const express = require('express');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/* ──────────────  PROFILE PICTURE  ────────────── */
router.post('/profile-picture', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, 'artspace/profiles');

    // update + return *fresh* user doc
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.profilePicture': result.secure_url },
      { new: true }
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      imageUrl: result.secure_url,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ──────────────  PORTFOLIO IMAGES  ────────────── */
router.post('/portfolio', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });

    const uploads = req.files.map(f => uploadToCloudinary(f.buffer, 'artspace/portfolio'));
    const results = await Promise.all(uploads);
    const urls = results.map(r => r.secure_url);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { 'profile.portfolio': { $each: urls } } },
      { new: true }
    );

    res.json({
      message: 'Portfolio images uploaded successfully',
      imageUrls: urls,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
