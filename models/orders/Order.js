const mongoose = require('mongoose');
const User = require('../users/User');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dt_order: {
    type: Date,
    default: Date.now
  },
  dt_payment: Date,
  total_price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    default: 'PENDING'
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
