const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq','fill','transform','error'], required: true },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: String,
});

const lessonSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true, unique: true },
  topic: { type: String, required: true },
  explanation: { type: String, required: true },
  rules: [String],
  examples: [String],
  commonMistakes: [String],
  questions: [questionSchema],
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' },
  timeLimit: { type: Number, default: 1800 },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
