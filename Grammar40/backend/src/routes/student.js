const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Student = require('../models/Student');
const Progress = require('../models/Progress');
const Announcement = require('../models/Announcement');

router.get('/profile', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/progress', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user._id }).populate('lesson', 'topic dayNumber');
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/leaderboard', protect, async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' })
      .select('name class streak totalScore currentDay')
      .sort({ totalScore: -1, streak: -1 })
      .limit(50);
    const ranked = students.map((s, i) => ({ rank: i + 1, ...s.toObject() }));
    res.json(ranked);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/announcements', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 }).limit(10);
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
