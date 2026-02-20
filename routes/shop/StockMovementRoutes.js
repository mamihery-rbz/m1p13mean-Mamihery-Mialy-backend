const express = require('express');
const router = express.Router();

const stockMovementService = require('../../services/shop/StockMovementService');


router.get('/stock/:productId', async (req, res) => {
    try {
        const stock = await stockMovementService.get_product_stock(req.params.productId);
        res.json({ stock });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/stock/history/:productId', async (req, res) => {
    try {
        const history = await stockMovementService.get_product_stock_history(req.params.productId);
        res.json(history);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Faire entree de stock
router.post('/stock/in', async (req, res) => {
    try {
        const { productId, quantity, description } = req.body;

        const movement = await stockMovementService.stock_in(productId, quantity, description);
        res.status(201).json({
            message: 'Entrée en stock effectuée',
            movement
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Faire sortie de stock
router.post('/stock/out', async (req, res) => {
    try {
        const { productId, quantity, description } = req.body;

        const movement = await stockMovementService.stock_out(productId, quantity, description);
        res.status(201).json({
            message: 'Sortie de stock effectuée',
            movement
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;