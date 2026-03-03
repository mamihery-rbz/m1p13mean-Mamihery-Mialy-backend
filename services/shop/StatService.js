const OrderDetail = require('../../models/orders/OrderDetail');
const Order = require('../../models/orders/Order');
const mongoose = require('mongoose');

async function get_monthly_turnover_by_shop(shopId, year = new Date().getFullYear()) {
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw new Error('shopId invalide');
  }

  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  const stats = await OrderDetail.aggregate([
        {
            $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'order'
            }
        },
        { $unwind: '$order' },

        {
            $match: {
                'order.shop': shopObjectId,
                'order.dt_payment': { $ne: null },
                status: { $ne: 'CANCELLED' },
                $expr: {
                    $eq: [{ $year: '$order.dt_payment' }, year]
                }
            }
        },

        {
            $addFields: {
                line_total: { $multiply: ['$quantity', '$price'] }
            }
        },

        {
            $group: {
                _id: { month: { $month: '$order.dt_payment' } },
                turnover: { $sum: '$line_total' }
            }
        },

        { $sort: { '_id.month': 1 } }
    ]);


  const result = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = stats.find(s => s._id.month === month);
    return {
      month,
      turnover: found ? found.turnover : 0
    };
  });

  return result;
}


async function get_monthly_customers_by_shop(shopId, year = new Date().getFullYear()) {
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw new Error('shopId invalide');
  }

  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  const stats = await Order.aggregate([
    {
      $match: {
        shop: shopObjectId,
        dt_payment: { $ne: null },
        $expr: {
          $eq: [{ $year: '$dt_payment' }, year]
        }
      }
    },

    // Regrouper par mois + client 
    {
      $group: {
        _id: {
          month: { $month: '$dt_payment' },
          user: '$user'
        }
      }
    },

    // Compter les clients par mois
    {
      $group: {
        _id: '$_id.month',
        customers: { $sum: 1 }
      }
    },

    // Trier par mois
    { $sort: { _id: 1 } }
  ]);

  // Normalisation → toujours 12 mois
  const result = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = stats.find(s => s._id === month);
    return {
      month,
      customers: found ? found.customers : 0
    };
  });

  return result;
}



async function get_orders_kpi_by_shop(shopId) {

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw new Error('shopId invalide');
  }

  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  const stats = await Order.aggregate([
    {
      $match: {
        shop: shopObjectId
      }
    },
    {
      $group: {
        _id: null,
        total_orders: { $sum: 1 },

        paid_orders: {
          $sum: {
            $cond: [{ $ne: ['$dt_payment', null] }, 1, 0]
          }
        },

        unpaid_orders: {
          $sum: {
            $cond: [{ $eq: ['$dt_payment', null] }, 1, 0]
          }
        },

        pending_orders: {
          $sum: {
            $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0]
          }
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      total_orders: 0,
      paid_orders: 0,
      unpaid_orders: 0,
      pending_orders: 0
    };
  }

  return stats[0];
}


module.exports = {
  get_monthly_turnover_by_shop,
  get_monthly_customers_by_shop,
  get_orders_kpi_by_shop
};
