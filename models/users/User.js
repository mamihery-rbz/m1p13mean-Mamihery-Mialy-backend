const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['ADMIN', 'SHOP', 'USER'],
    default: 'USER',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
