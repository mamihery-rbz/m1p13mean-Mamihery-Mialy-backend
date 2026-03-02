const Shop = require('../../models/shop/Shop');
const Product = require('../../models/product/Product');
const Order = require('../../models/orders/Order');
const OrderDetail = require('../../models/orders/OrderDetail');

async function listShops() {
  return Shop.find();
}

async function listProductsByShop(shopId) {
  return Product.find({ shop: shopId });
}

async function getUserOrders(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return Order.find({ user: userId });
}

async function createOrder(userId, shopId, items = []) {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!shopId) {
    throw new Error('shopId is required');
  }
  
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new Error('Shop not found');
  }
  
  if (items && items.length > 0) {
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.shop.toString() !== shopId) {
        throw new Error(`Product ${item.productId} does not belong to shop ${shopId}`);
      }
    }
  }
  
  const order = new Order({ user: userId, shop: shopId, total_price: 0 });
  await order.save();
  
  if (items && items.length > 0) {
    for (const item of items) {
      const detail = new OrderDetail({
        order: order._id,
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      });
      await detail.save();
    }
    await recalcTotal(order._id);
  }
  
  // Retourner l'ordre avec les détails
  const populatedOrder = await Order.findById(order._id).populate('shop').populate('user');
  const details = await OrderDetail.find({ order: order._id }).populate('product');
  
  return { order: populatedOrder, details };
}

async function getOrderDetails(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (userId && order.user.toString() !== userId) throw new Error('Unauthorized');
  return OrderDetail.find({ order: orderId }).populate('product');
}

async function addOrderDetail(orderId, productId, quantity, price, userId) {
  
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (userId && order.user.toString() !== userId) throw new Error('Unauthorized');

  const detail = new OrderDetail({ order: orderId, product: productId, quantity, price });
  await detail.save();
  await recalcTotal(orderId);
  return detail;
}

async function updateOrderDetail(detailId, data, userId) {
  const detail = await OrderDetail.findById(detailId);
  if (!detail) throw new Error('Order detail not found');
  if (userId) {
    const order = await Order.findById(detail.order);
    if (!order) throw new Error('Parent order not found');
    if (order.user.toString() !== userId) throw new Error('Unauthorized');
  }
  Object.assign(detail, data);
  await detail.save();
  await recalcTotal(detail.order);
  return detail;
}

async function deleteOrderDetail(detailId, userId) {
  const detail = await OrderDetail.findById(detailId);
  if (!detail) throw new Error('Order detail not found');
  if (userId) {
    const order = await Order.findById(detail.order);
    if (!order) throw new Error('Parent order not found');
    if (order.user.toString() !== userId) throw new Error('Unauthorized');
  }
  const orderId = detail.order;
  await OrderDetail.deleteOne({ _id: detailId });
  await recalcTotal(orderId);
}

async function recalcTotal(orderId) {
  const details = await OrderDetail.find({ order: orderId });
  const total = details.reduce((sum, d) => sum + d.quantity * d.price, 0);
  await Order.findByIdAndUpdate(orderId, { total_price: total });
}

module.exports = {
  listShops,
  listProductsByShop,
  getUserOrders,
  createOrder,
  getOrderDetails,
  addOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
