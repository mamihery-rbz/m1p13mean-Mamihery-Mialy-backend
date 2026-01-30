const mongoose = require('mongoose');
const Product = require('../product/Product');

const StockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  in: { type: Number, default: 0 },
  out: { type: Number, default: 0 },
  dt_time: {
    type: Date,
    default: Date.now
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('stock_movement', StockMovementSchema);
