const mongoose = require('mongoose');
const Product = require('./Product');

const ProductPriceHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: { type: Number, required: true },
  dt_begin: { type: Date, required: true },
  dt_end: Date
}, { timestamps: true });

module.exports = mongoose.model('product_price_history', ProductPriceHistorySchema);
