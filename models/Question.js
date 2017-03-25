const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  choices: [String],
  answer: Number,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
