const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Student = require('../models/Student');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Announcement = require('../models/Announcement');

router.use(protect, adminOnly);

router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments({ role: 'student' });
    const today = new Date(); today.setHours(0,0,0,0);
    const active = await Progress.distinct('student', { submissionTime: { $gte: today } });
    const completed = await Progress.countDocuments({ completed: true, submissionTime: { $gte: today } });
    const allProgress = await Progress.find({ completed: true });
    const avg = allProgress.length ? (allProgress.reduce((a, p) => a + p.finalScore, 0) / allProgress.length).toFixed(1) : 0;
    res.json({ total, activeToday: active.length, completedToday: completed, averageScore: avg });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/students', async (req, res) => {
  try {
    const { search, class: cls } = req.query;
    const query = { role: 'student' };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { rollNumber: new RegExp(search, 'i') }];
    if (cls) query.class = cls;
    const students = await Student.find(query).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Progress.deleteMany({ student: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/students/:id/reset', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { currentDay: 1, streak: 0, totalScore: 0, unlockedDays: [1] });
    await Progress.deleteMany({ student: req.params.id });
    res.json({ message: 'Progress reset' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/students/:id/unlock/:day', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    await Student.findByIdAndUpdate(req.params.id, { $addToSet: { unlockedDays: day } });
    res.json({ message: 'Day unlocked' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/students/:id/progress', async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.params.id }).populate('lesson', 'topic dayNumber');
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/announcements', async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).select('name class streak totalScore currentDay rollNumber').sort({ totalScore: -1 }).limit(100);
    res.json(students.map((s, i) => ({ rank: i+1, ...s.toObject() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
