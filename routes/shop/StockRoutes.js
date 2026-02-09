const express = require('express');
const router = express.Router();
const stockService = require('../../services/shop/StockService');


router.get('/product', async (req, res) => {
  try {
    const userId = req.body.userId;
    const stocks = await stockService.get_shop_stock_by_user(userId);
    res.json(stocks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/product/:productId', async (req, res) => {
  try {
    const stock = await stockService.get_product_stock(req.params.productId);
    res.json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;