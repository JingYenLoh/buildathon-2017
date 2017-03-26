const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  name: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  meaning: String,
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
