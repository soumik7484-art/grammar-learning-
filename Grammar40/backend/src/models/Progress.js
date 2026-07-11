const mongoose = require('mongoose');

const penaltyLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  durationAway: Number,
  penaltyPoints: Number,
});

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  dayNumber: Number,
  answers: [{ questionIndex: Number, answer: String }],
  rawScore: { type: Number, default: 0 },
  penalty: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  submissionTime: Date,
  timeTaken: Number,
  penaltyLog: [penaltyLogSchema],
  tabSwitches: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
