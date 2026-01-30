const mongoose = require('mongoose');
const Shop = require('./Shop');

const PaymentHistorySchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  dt_payment: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('payment_history', PaymentHistorySchema);
