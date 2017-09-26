const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    year: Number,
    week: Number
});

HistorySchema.index({
  year: 1,
  week: 1,
}, {
  unique: true
});

const History = mongoose.model('History', HistorySchema);

module.exports = History;
