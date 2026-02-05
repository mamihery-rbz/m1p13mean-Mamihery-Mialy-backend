const StockMovement = require('../../models/stock/StockMovement');
const mongoose = require('mongoose');
const product = require('../../models/product/Product');

async function get_product_stock(productId) {
    const objectId = new mongoose.Types.ObjectId(productId);
    const result = await StockMovement.aggregate([
        { $match: { product: objectId } }, 
        {
        $group: {
            _id: '$product',
            totalIn: { $sum: '$in' },
            totalOut: { $sum: '$out' }
        }
        }
    ]);

    if (result.length === 0) return 0;

    return result[0].totalIn - result[0].totalOut;
}


async function stock_in(productId, quantity, description = 'Entrée en stock') {
    if (quantity <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
    }

    return await StockMovement.create({
        product: productId,
        in: quantity,
        description
    });
}

async function stock_out(productId, quantity, description = 'Sortie de stock') {
    if (quantity <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
    }

    const currentStock = await get_product_stock(productId);
    const productToOut = await product.findById(productId);

    if (currentStock < quantity) {
        throw new Error('Stock insuffisant. Vous avez '+currentStock+' en stock pour effectué une sortie de '+quantity+ ' ' +productToOut.name);
    }

    return await StockMovement.create({
        product: productId,
        out: quantity,
        description
    });
}


module.exports = {
  get_product_stock,
  stock_in,
  stock_out
};