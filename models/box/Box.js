const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema({
  floor: { type: Number, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Box', BoxSchema);
