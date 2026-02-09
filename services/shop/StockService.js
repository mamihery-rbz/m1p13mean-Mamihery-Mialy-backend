const StockMovement = require('../../models/stock/StockMovement');
const OrderDetail = require('../../models/orders/OrderDetail');
const mongoose = require('mongoose');
const { get_shop_products_by_user } = require('./ShopServices');

async function get_product_stock(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('productId invalide');
  }

  const objectId = new mongoose.Types.ObjectId(productId);

  // Stock total (entrées - sorties)
  const stockMovement = await StockMovement.aggregate([
    { $match: { product: objectId } },
    {
      $group: {
        _id: '$product',
        totalIn: { $sum: '$in' },
        totalOut: { $sum: '$out' }
      }
    }
  ]);

  const stockTotal =
    stockMovement.length === 0
      ? 0
      : stockMovement[0].totalIn - stockMovement[0].totalOut;

  // Produits réservés (PENDING + PREPARATION)
  const reserved = await OrderDetail.aggregate([
    {
      $match: {
        product: objectId,
        status: { $in: ['PENDING', 'PREPARATION'] }
      }
    },
    {
      $group: {
        _id: '$product',
        quantity: { $sum: '$quantity' }
      }
    }
  ]);

  const reservedQuantity = reserved.length ? reserved[0].quantity : 0;

  // Produits livrés (sortie réelle)
  const delivered = await OrderDetail.aggregate([
    {
      $match: {
        product: objectId,
        status: 'DELIVERED'
      }
    },
    {
      $group: {
        _id: '$product',
        quantity: { $sum: '$quantity' }
      }
    }
  ]);

  const deliveredQuantity = delivered.length ? delivered[0].quantity : 0;

  // Stock disponible réel
  const stockAvailable = stockTotal - reservedQuantity - deliveredQuantity;

  return {
    stock_total: stockTotal,
    reserved: reservedQuantity,
    delivered: deliveredQuantity,
    stock_available: stockAvailable
  };
}

async function get_shop_stock_by_user(userId) {
  // Récupérer tous les produits de la boutique
  const products = await get_shop_products_by_user(userId);

  // Pour chaque produit on recupere le stock
  const stockList = [];
  for (const product of products) {
    const stock = await get_product_stock(product._id);
    stockList.push({
      product_id: product._id,
      product_name: product.name,
      category: product.category_product.name,
      stock_total: stock.stock_total,
      reserved: stock.reserved,
      delivered: stock.delivered,
      stock_available: stock.stock_available
    });
  }

  return stockList;
}

module.exports = {
  get_product_stock,
  get_shop_stock_by_user
};
