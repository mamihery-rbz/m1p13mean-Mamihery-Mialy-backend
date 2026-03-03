const mongoose = require('mongoose');
const Shop = require('../shop/Shop');
const CategoryProduct = require('./CategoryProduct');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    type: String,
    required: false
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  category_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category_product',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
