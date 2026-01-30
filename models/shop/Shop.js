const mongoose = require('mongoose');
const Box = require('../box/Box');

const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);
