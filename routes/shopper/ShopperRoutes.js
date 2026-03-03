const express = require('express');
const router = express.Router();
const shopperService = require('../../services/shopper/ShopperService');
const auth = require('../../middlewares/auth/authMiddleware');
const Order = require('../../models/orders/Order');

// return all shops
router.get('/shops', async (req, res) => {
  try {
    const shops = await shopperService.listShops();
    res.json(shops);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// return products for a given shop
router.get('/shops/:shopId/products', async (req, res) => {
  try {
    const products = await shopperService.listProductsByShop(req.params.shopId);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list orders for a given user (userId may come from query/body or token middleware)
router.get('/orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await shopperService.getUserOrders(userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId, items } = req.body;
    const result = await shopperService.createOrder(userId, shopId, items);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/orders/:orderId', auth, async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: 'Commande supprimée avec succès', order: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// order details for a specific order (optionally verify ownership)
router.get('/orders/:orderId/details', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const details = await shopperService.getOrderDetails(req.params.orderId, userId);
    res.json(details);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// add a product to order details
router.post('/orders/:orderId/details', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, price } = req.body;
    const detail = await shopperService.addOrderDetail(
      req.params.orderId,
      productId,
      quantity,
      price,
      userId
    );
    res.status(201).json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// update a detail record
router.put('/orders/:orderId/details/:detailId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const detail = await shopperService.updateOrderDetail(req.params.detailId, req.body, userId);
    res.json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete a detail record
router.delete('/orders/:orderId/details/:detailId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    await shopperService.deleteOrderDetail(req.params.detailId, userId);
    res.json({ success: 'Detail deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
