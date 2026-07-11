const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const Student = require('../models/Student');
const Progress = require('../models/Progress');

router.get('/today', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const lesson = await Lesson.findOne({ dayNumber: student.currentDay });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    // shuffle questions with database indices
    const shuffled = lesson.questions.map((q, idx) => ({ ...q.toObject(), dbIndex: idx })).sort(() => Math.random() - 0.5);
    const progress = await Progress.findOne({ student: student._id, lesson: lesson._id });
    res.json({ lesson: { ...lesson.toObject(), questions: shuffled }, progress, completed: progress?.completed || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/day/:day', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const day = parseInt(req.params.day);
    if (day > student.currentDay && !student.unlockedDays.includes(day))
      return res.status(403).json({ message: 'Lesson locked' });
    const lesson = await Lesson.findOne({ dayNumber: day });
    if (!lesson) return res.status(404).json({ message: 'Not found' });
    // shuffle questions with database indices
    const shuffled = lesson.questions.map((q, idx) => ({ ...q.toObject(), dbIndex: idx })).sort(() => Math.random() - 0.5);
    const progress = await Progress.findOne({ student: student._id, lesson: lesson._id });
    res.json({ lesson: { ...lesson.toObject(), questions: shuffled }, progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/submit', protect, async (req, res) => {
  try {
    const { lessonId, answers, timeTaken, penalty } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const existing = await Progress.findOne({ student: req.user._id, lesson: lessonId });
    if (existing?.completed) return res.status(400).json({ message: 'Already submitted' });

    let rawScore = 0;
    const results = lesson.questions.map((q, i) => {
      const correct = answers[i]?.answer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (correct) rawScore += 2;
      return { questionIndex: i, correct, correctAnswer: q.correctAnswer };
    });
    const penaltyPoints = Math.min(rawScore, penalty || 0);
    const finalScore = Math.max(0, rawScore - penaltyPoints);

    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      { answers, rawScore, penalty: penaltyPoints, finalScore, completed: true, submissionTime: new Date(), timeTaken, dayNumber: lesson.dayNumber },
      { upsert: true, new: true }
    );

    // update student
    const student = await Student.findById(req.user._id);
    student.totalScore += finalScore;
    const today = new Date().toDateString();
    const lastDate = student.lastSubmissionDate ? new Date(student.lastSubmissionDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === yesterday) { student.streak += 1; }
    else if (lastDate !== today) { student.streak = 1; }
    student.longestStreak = Math.max(student.longestStreak, student.streak);
    student.lastSubmissionDate = new Date();
    if (student.currentDay < 40) { student.currentDay += 1; student.unlockedDays.push(student.currentDay); }
    // badges
    if (student.streak >= 7 && !student.badges.includes('Week Warrior')) student.badges.push('Week Warrior');
    if (student.totalScore >= 100 && !student.badges.includes('Century Club')) student.badges.push('Century Club');
    if (finalScore === 20 && !student.badges.includes('Perfect Day')) student.badges.push('Perfect Day');
    await student.save();

    res.json({ finalScore, rawScore, penalty: penaltyPoints, results, isSuccessful: finalScore > 0, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
