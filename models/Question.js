const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  question: String,
  choices: [String],
  answer: Number,
  meaning: String,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
