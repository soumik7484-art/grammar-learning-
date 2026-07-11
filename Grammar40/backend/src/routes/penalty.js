const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

router.post('/log', protect, async (req, res) => {
  try {
    const { lessonId, durationAway, penaltyPoints } = req.body;
    await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      {
        $push: { penaltyLog: { durationAway, penaltyPoints, timestamp: new Date() } },
        $inc: { tabSwitches: 1 }
      },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
