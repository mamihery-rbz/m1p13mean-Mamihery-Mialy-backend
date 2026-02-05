const express = require('express');
const router = express.Router();
const Shop = require('../../models/shop/Shop');
const PaymentHistory = require('../../models/shop/PaymentHistory');
const Order = require('../../models/orders/Order');


router.get('/loyer/:shopId', async (req, res) => {
  try {
    const shopId = req.params.shopId;

    const shop = await Shop.findById(shopId).populate('box');
    if (!shop) {
      return res.status(404).json({ message: 'Shop non trouvé' });
    }

    const box = shop.box;

    const loyerTotal = box.price;

    const payments = await PaymentHistory.find({ shop: shop._id }).sort({ dt_payment: -1 });

    const lastPayment = payments[0] || null;

    let nextMonthDate = new Date();
    if (lastPayment) {
      const lastPaymentDate = new Date(lastPayment.dt_payment);
      nextMonthDate = new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + 1));
    }

    const monthToPay = nextMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const lastDayOfMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0);

    const totalPayé = payments.length * loyerTotal;

    const reste = Math.max(0, loyerTotal - totalPayé);

    res.json({
      shopId: shop._id,
      shopName: shop.name,
      boxId: box._id,
      boxNumber: `Etage ${box.floor} - Taille ${box.size}`,
      loyer: loyerTotal,
      total_payé: totalPayé,
      reste: reste,
      month_to_pay: monthToPay,
      last_day_of_month: lastDayOfMonth,
      last_payment_date: lastPayment ? lastPayment.dt_payment : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/loyer-non-payer', async (req, res) => {
  try {
    const today = new Date();

    const shops = await Shop.find().populate('box');

    const result = [];

    for (const shop of shops) {
      const box = shop.box;

      const lastPayment = await PaymentHistory.find({ shop: shop._id })
        .sort({ dt_payment: -1 })
        .limit(1);

      let lastPaymentDate;
      if (lastPayment.length > 0) {
        lastPaymentDate = lastPayment[0].dt_payment;
      } else {
        lastPaymentDate = null;
      }

      let nextMonth = new Date();
      if (lastPaymentDate) {
        const d = new Date(lastPaymentDate);
        nextMonth = new Date(d.setMonth(d.getMonth() + 1));
      }
      const lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

      const diffTime = today - lastDayOfMonth;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0 || !lastPaymentDate) {
        result.push({
          shopId: shop._id,
          shopName: shop.name,
          boxId: box._id,
          boxNumber: `Etage ${box.floor} - Taille ${box.size}`,
          floor: box.floor,
          loyer: box.price,
          last_payment_date: lastPaymentDate,
          last_day_of_month: lastDayOfMonth,
          days_delay: -diffDays 
        });
      }
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/nombre-client', async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'order_details',
          localField: '_id',
          foreignField: 'order',
          as: 'details'
        }
      },
      { $unwind: '$details' },

      {
        $lookup: {
          from: 'products',
          localField: 'details.product',
          foreignField: '_id',
          as: 'product_info'
        }
      },
      { $unwind: '$product_info' },

      {
        $lookup: {
          from: 'shops',
          localField: 'product_info.shop',
          foreignField: '_id',
          as: 'shop_info'
        }
      },
      { $unwind: '$shop_info' },

      {
        $addFields: {
          year: { $year: '$dt_order' },
          month: { $month: '$dt_order' }
        }
      },

      {
        $group: {
          _id: {
            shopId: '$shop_info._id',
            shopName: '$shop_info.name',
            year: '$year',
            month: '$month',
            userId: '$user'
          }
        }
      },

      {
        $group: {
          _id: {
            shopId: '$_id.shopId',
            shopName: '$_id.shopName',
            year: '$_id.year',
            month: '$_id.month'
          },
          nombre_clients: { $sum: 1 }
        }
      },

      {
        $sort: {
          '_id.shopName': 1,
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ];

    const result = await Order.aggregate(pipeline);

    const formatted = result.map(r => ({
      shopId: r._id.shopId,
      shopName: r._id.shopName,
      year: r._id.year,
      month: r._id.month,
      nombre_clients: r.nombre_clients
    }));

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/*

router.get('/loyer/:id', async (req, res) => {
  try {
    const shopId = req.params.id;

    const shop = await Shop.findById(shopId).populate('box');
    if (!shop) {
      return res.status(404).json({ message: 'Shop non trouvé' });
    }

    const loyerTotal = shop.box.price;

    const payments = await PaymentHistory.find({ shop: shop._id });

    const totalPayé = payments.length * loyerTotal;

    const reste = Math.max(0, loyerTotal - totalPayé);

    res.json({
      shopId: shop._id,
      boxId: shop.box._id,
      loyer_total: loyerTotal,
      payé: totalPayé,
      reste
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

*/