const express = require('express');
const router = express.Router();
const stockService = require('../../services/shop/StockService');
const auth = require('../../middlewares/auth/authMiddleware');


router.get('/product', auth, async (req, res) => {
  try {
    const stocks = await stockService.get_shop_stock_by_user(req.user.id);
    res.json(stocks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/product/:productId', async (req, res) => {
  try {
    const stock = await stockService.get_product_stock(req.params.productId);
    res.json(stock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;