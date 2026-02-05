const express = require('express');
const router = express.Router();

const orderManagementService = require('../../services/shop/OrderManagementService');


// Liste de toutes les commandes
router.get('/orders_list', async (req, res) => {
    try {
        const {userId, shopId} = req.body;
        const orders = await orderManagementService.list_orders(userId, shopId);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Mise a jour des status des commandes
router.put('/update_order_status', async (req, res) => {
    try {
        const {id, status} = req.body;  
        const orderStatusUpdated = await orderManagementService.update_order_status(id, status);
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
        order_detail_status_updated: updatedDetail.orderDetail 
    });
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

