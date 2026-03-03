const express = require('express');
const router = express.Router();
const { get_shop_by_user } = require('../../services/shop/ShopServices');
const { get_monthly_turnover_by_shop } = require('../../services/shop/StatService');
const { get_monthly_customers_by_shop } = require('../../services/shop/StatService');
const { get_orders_kpi_by_shop } = require('../../services/shop/StatService');


const auth = require('../../middlewares/auth/authMiddleware');

// CA mensuel de la boutique du gérant
router.get('/turnover/monthly', auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    const year = req.query.year ? parseInt(req.query.year) : undefined;

    console.log("utilisateur : " +userId);

    const shop = await get_shop_by_user(userId);
        console.log("shop : " +shop._id);

    const stats = await get_monthly_turnover_by_shop(shop._id, year);

    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/customer/monthly', auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    const year = req.query.year ? parseInt(req.query.year) : undefined;

    const shop = await get_shop_by_user(userId);
    const stats = await get_monthly_customers_by_shop(shop._id, year);

    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/order-kpi', auth, async (req, res) => {
  try {
    const userId = req.user.id; 

    const shop = await get_shop_by_user(userId);
    const statsKPI = await get_orders_kpi_by_shop(shop._id);

    res.json(statsKPI);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
