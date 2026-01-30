const mongoose = require('mongoose');
const Box = require('./Box');

const BoxPriceHistorySchema = new mongoose.Schema({
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  price: { type: Number, required: true },
  dt_begin: { type: Date, required: true },
  dt_end: Date
}, { timestamps: true });

module.exports = mongoose.model('box_price_history', BoxPriceHistorySchema);