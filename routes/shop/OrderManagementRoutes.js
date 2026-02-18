const express = require('express');
const router = express.Router();
const Order = require('../../models/orders/Order');
const orderManagementService = require('../../services/shop/OrderManagementService');
const auth = require('../../middlewares/auth/authMiddleware');

router.post('/orders', auth, async (req, res) => {
  try {
    const { user, dt_payment, total_price, shop, status } = req.body;

    const order = new Order({
      user,
      shop,
      dt_payment,
      total_price,
      status
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Liste de toutes les commandes
router.get('/orders_list', auth, async (req, res) => {
    try {
        // const {shopId} = req.body;
        const orders = await orderManagementService.list_orders(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Mise a jour des status des commandes
router.put('/update_order_status', async (req, res) => {
    try {
        const {idOrder, status, dt_payment} = req.body; 
        console.log("Date de payement : "+dt_payment); 
        const orderStatusUpdated = await orderManagementService.update_order_status(idOrder, status, dt_payment);
        res.json({
            message: orderStatusUpdated.message, 
            order_status_updated: orderStatusUpdated.order 
        });

    } catch (error) {
        res.status(400).json({error: error.message});        
    }
});

// Les details d'une commande
router.get('/order_details/:orderId', async (req, res) => {
    try {
        const details = await orderManagementService.list_order_details(req.params.orderId);
        res.json(details);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mise a jour status d'un detail 
router.put('/update_order_detail_status', async (req, res) => {
  try {
    const { id, status } = req.body;
    const updatedDetail = await orderManagementService.update_order_detail_status(id, status);

    res.json({ 
        message: updatedDetail.message, 
        order_detail_status_updated: updatedDetail.updatedOrder 
    });
    console.log("Updated Detail : "+updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Annulation d'une commande
router.put('/cancel_order/:orderId', async (req, res) => {
    try {
        const result = await orderManagementService.cancel_order(req.params.orderId);

        res.json({ message: 'Order status cancelled', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

