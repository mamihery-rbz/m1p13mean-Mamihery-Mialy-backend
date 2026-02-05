const Order = require('../../models/orders/Order');
const OrderDetail = require('../../models/orders/OrderDetail');
const mongoose = require('mongoose');

// Pour avoir la liste des commandes des clients (par shopId et userId (gestionnaire de sa boutique))
async function list_orders(userId = null, shopId = null) {
    let match = {};
    if (shopId) match.shop = new mongoose.Types.ObjectId(shopId);

    let orders = await Order.aggregate([
        { $match: match },
        // jointure avec la collection shops
        { $lookup: {
            from: 'shops',
            localField: 'shop',
            foreignField: '_id',
            as: 'shop'
        }},
        { $unwind: '$shop' }, 
        // jointure avec la collection users (gestionnaire) dans la boutique
        { $lookup: {
            from: 'users',
            localField: 'shop.user',
            foreignField: '_id',
            as: 'shop.user'
        }},
        { $unwind: '$shop.user' },
        // filtre sur le gestionnaire
        { $match: { 'shop.user._id': new mongoose.Types.ObjectId(userId) } },

        // Jointure avec client
        { $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        }},
        { $unwind: '$user' },

        { $project: {
            'user.password': 0,      
            'user.__v': 0,           
            'shop.__v': 0,           
            'shop.user.password': 0,
            'shop.user.__v': 0
        }},
        { $sort: { createdAt: -1 } }
    ]);
    return orders;
}



async function list_order_details(orderId){
    const orderDetails = await OrderDetail.find({order: orderId}).populate('product');
    return orderDetails;
}

async function update_order_detail_status(orderDetailId, status) {
    const allowedStatus = ['PENDING', 'PREPARATION', 'DELIVERED', 'CANCELLED'];

    if (!allowedStatus.includes(status)) {
        throw new Error('Invalid status');
    }

    const orderDetail = await OrderDetail.findByIdAndUpdate(orderDetailId, { status }, { new: true });

    if (!orderDetail) {
        throw new Error('Order detail not found');
    }

    let message = getOrderDetailStatusMessage(status);

    return {
        message,
        orderDetail
    };
}


function getOrderDetailStatusMessage(status) {
    switch (status) {
        case 'PENDING':
        return 'Le détail de la commande est en attente';
        case 'PREPARATION':
        return 'Le produit est en cours de préparation';
        case 'DELIVERED':
        return 'Le produit a été livré avec succès';
        case 'CANCELLED':
        return 'Le produit a été annulé';
        default:
        return 'Statut mis à jour';
    }
}


async function update_order_status(orderId, status) {
    const allowedStatus = ['PENDING', 'PAID', 'CANCELLED'];

    if (!allowedStatus.includes(status)) {
        throw new Error('Invalid status');
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
        throw new Error('Order not found');
    }

    let message = getOrderStatusMessage(status);

    return {
        message,
        order
    };
}

function getOrderStatusMessage(status) {
    switch (status) {
        case 'PENDING':
        return 'La commande est repassée en attente';
        case 'PAID':
        return 'La commande a été payée avec succès';
        case 'CANCELLED':
        return 'La commande a été annulée avec succès';
        default:
        return 'Statut mis à jour';
    }
}


async function cancel_order(orderId) {
    await Order.findByIdAndUpdate(orderId, {status: 'CANCELLED'});

    await OrderDetail.updateMany(
        { order: orderId },
        { status: 'CANCELLED' }
    );

    return { message: 'Order cancelled successfully' };
}


module.exports = {
  list_orders,
  list_order_details,
  update_order_detail_status,
  update_order_status,
  cancel_order
};
