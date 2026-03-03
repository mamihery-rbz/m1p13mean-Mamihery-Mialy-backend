const express = require('express');
const router = express.Router();

const stockMovementService = require('../../services/shop/StockMovementService');
const StockMovement = require('../../models/stock/StockMovement');

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

router.get('/stock/history/filter/:productId', async (req, res) => {
    try {

        const { dateMin, dateMax, quantityMin, type } = req.query;

        let filter = {
            product: req.params.productId
        };

        // 🔹 Filtre date
        if (dateMin || dateMax) {
            filter.dt_time = {};
            if (dateMin) filter.dt_time.$gte = new Date(dateMin);
            if (dateMax) filter.dt_time.$lte = new Date(dateMax);
        }

        if (quantityMin) {
            filter.$or = [
                { in: { $gte: Number(quantityMin) } },
                { out: { $gte: Number(quantityMin) } }
            ];
        }

        if (type === 'IN') {
            filter.in = { $gt: 0 };
        }

        if (type === 'OUT') {
            filter.out = { $gt: 0 };
        }

        const historyStockMovementProduct = await StockMovement
        .find(filter)
        .sort({ dt_time: -1 });
        
        res.json(historyStockMovementProduct);

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