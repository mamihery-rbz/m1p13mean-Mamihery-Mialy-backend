const express = require('express');
const router = express.Router();
const Box = require('../../models/box/Box');
const BoxPriceHistory = require('../../models/box/BoxPriceHistory');
const Order = require('../../models/orders/Order');
const OrderDetail = require('../../models/orders/OrderDetail');
const CategoryProduct = require('../../models/product/CategoryProduct');
const Product = require('../../models/product/Product');
const ProductPriceHistory = require('../../models/product/ProductPriceHistory');
const PaymentHistory = require('../../models/shop/PaymentHistory');
const Shop = require('../../models/shop/Shop');
const StockMovement = require('../../models/stock/StockMovement');
const User = require('../../models/users/User');

//boxes
router.post('/boxes', async (req, res) => {
  try {
    const { floor, size, price } = req.body;

    const box = new Box({
      floor,
      size,
      price
    });

    const savedBox = await box.save();

    res.status(201).json(savedBox);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/boxes', async (req, res) => {
  try {
    const boxes = await Box.find();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/boxes/:id', async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);

    if (!box) {
      return res.status(404).json({ message: 'Box non trouvée' });
    }

    res.json(box);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/boxes/:id', async (req, res) => {
  try {
    const updatedBox = await Box.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBox) {
      return res.status(404).json({ message: 'Box non trouvée' });
    }

    res.json(updatedBox);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/boxes/:id', async (req, res) => {
  try {
    const deletedBox = await Box.findByIdAndDelete(req.params.id);

    if (!deletedBox) {
      return res.status(404).json({ message: 'Box non trouvée' });
    }

    res.json({ message: 'Box supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//boxPrice history
router.post('/box-price-history', async (req, res) => {
  try {
    const { box, price, dt_begin, dt_end } = req.body;

    const history = new BoxPriceHistory({
      box,
      price,
      dt_begin,
      dt_end
    });

    const savedHistory = await history.save();

    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/box-price-history', async (req, res) => {
  try {
    const histories = await BoxPriceHistory
      .find()
      .populate('box');

    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/box-price-history/:id', async (req, res) => {
  try {
    const history = await BoxPriceHistory
      .findById(req.params.id)
      .populate('box');

    if (!history) {
      return res.status(404).json({ message: 'Historique non trouvé' });
    }

    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/box-price-history/:id', async (req, res) => {
  try {
    const updatedHistory = await BoxPriceHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('box');

    if (!updatedHistory) {
      return res.status(404).json({ message: 'Historique non trouvé' });
    }

    res.json(updatedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/box-price-history/:id', async (req, res) => {
  try {
    const deletedHistory = await BoxPriceHistory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedHistory) {
      return res.status(404).json({ message: 'Historique non trouvé' });
    }

    res.json({ message: 'Historique supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//orders
router.post('/orders', async (req, res) => {
  try {
    const { user, dt_payment, total_price, status } = req.body;

    const order = new Order({
      user,
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

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order
      .find()
      .populate('user');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order
      .findById(req.params.id)
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//ordersdetails
router.post('/order-details', async (req, res) => {
  try {
    const { order, product, quantity, price, status } = req.body;

    const orderDetail = new OrderDetail({
      order,
      product,
      quantity,
      price,
      status
    });

    const savedOrderDetail = await orderDetail.save();

    res.status(201).json(savedOrderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/order-details', async (req, res) => {
  try {
    const orderDetails = await OrderDetail
      .find()
      .populate('order')
      .populate('product');

    res.json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/order-details/:id', async (req, res) => {
  try {
    const orderDetail = await OrderDetail
      .findById(req.params.id)
      .populate('order')
      .populate('product');

    if (!orderDetail) {
      return res.status(404).json({ message: 'Détail de commande non trouvé' });
    }

    res.json(orderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/order-details/:id', async (req, res) => {
  try {
    const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('order')
      .populate('product');

    if (!updatedOrderDetail) {
      return res.status(404).json({ message: 'Détail de commande non trouvé' });
    }

    res.json(updatedOrderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/order-details/:id', async (req, res) => {
  try {
    const deletedOrderDetail = await OrderDetail.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrderDetail) {
      return res.status(404).json({ message: 'Détail de commande non trouvé' });
    }

    res.json({ message: 'Détail de commande supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//categories products
router.post('/categories-products', async (req, res) => {
  try {
    const { name } = req.body;

    const category = new CategoryProduct({ name });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/categories-products', async (req, res) => {
  try {
    const categories = await CategoryProduct.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories-products/:id', async (req, res) => {
  try {
    const category = await CategoryProduct.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/categories-products/:id', async (req, res) => {
  try {
    const updatedCategory = await CategoryProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/categories-products/:id', async (req, res) => {
  try {
    const deletedCategory = await CategoryProduct.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//products
router.post('/products', async (req, res) => {
  try {
    const { name, price, image, shop, category_product } = req.body;

    const product = new Product({
      name,
      price,
      image,
      shop,
      category_product
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product
      .find()
      .populate('shop')
      .populate('category_product');

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product
      .findById(req.params.id)
      .populate('shop')
      .populate('category_product');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('shop')
      .populate('category_product');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//products price history
router.post('/product-price-history', async (req, res) => {
  try {
    const { product, price, dt_begin, dt_end } = req.body;

    const history = new ProductPriceHistory({
      product,
      price,
      dt_begin,
      dt_end
    });

    const savedHistory = await history.save();

    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/product-price-history', async (req, res) => {
  try {
    const histories = await ProductPriceHistory
      .find()
      .populate('product');

    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/product-price-history/:id', async (req, res) => {
  try {
    const history = await ProductPriceHistory
      .findById(req.params.id)
      .populate('product');

    if (!history) {
      return res.status(404).json({ message: 'Historique de prix non trouvé' });
    }

    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/product-price-history/:id', async (req, res) => {
  try {
    const updatedHistory = await ProductPriceHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product');

    if (!updatedHistory) {
      return res.status(404).json({ message: 'Historique de prix non trouvé' });
    }

    res.json(updatedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/product-price-history/:id', async (req, res) => {
  try {
    const deletedHistory = await ProductPriceHistory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedHistory) {
      return res.status(404).json({ message: 'Historique de prix non trouvé' });
    }

    res.json({ message: 'Historique de prix supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//shop
router.post('/shops', async (req, res) => {
  try {
    const { name, description, box } = req.body;

    const shop = new Shop({
      name,
      description,
      box
    });

    const savedShop = await shop.save();

    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/shops', async (req, res) => {
  try {
    const shops = await Shop
      .find()
      .populate('box');

    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop
      .findById(req.params.id)
      .populate('box');

    if (!shop) {
      return res.status(404).json({ message: 'Shop non trouvé' });
    }

    res.json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/shops/:id', async (req, res) => {
  try {
    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('box');

    if (!updatedShop) {
      return res.status(404).json({ message: 'Shop non trouvé' });
    }

    res.json(updatedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/shops/:id', async (req, res) => {
  try {
    const deletedShop = await Shop.findByIdAndDelete(
      req.params.id
    );

    if (!deletedShop) {
      return res.status(404).json({ message: 'Shop non trouvé' });
    }

    res.json({ message: 'Shop supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//payment history
router.post('/payment-histories', async (req, res) => {
  try {
    const { shop, dt_payment } = req.body;

    const paymentHistory = new PaymentHistory({
      shop,
      dt_payment
    });

    const savedPaymentHistory = await paymentHistory.save();

    res.status(201).json(savedPaymentHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/payment-histories', async (req, res) => {
  try {
    const histories = await PaymentHistory
      .find()
      .populate('shop');

    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/payment-histories/:id', async (req, res) => {
  try {
    const history = await PaymentHistory
      .findById(req.params.id)
      .populate('shop');

    if (!history) {
      return res.status(404).json({ message: 'Historique de paiement non trouvé' });
    }

    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/payment-histories/:id', async (req, res) => {
  try {
    const updatedHistory = await PaymentHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('shop');

    if (!updatedHistory) {
      return res.status(404).json({ message: 'Historique de paiement non trouvé' });
    }

    res.json(updatedHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/payment-histories/:id', async (req, res) => {
  try {
    const deletedHistory = await PaymentHistory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedHistory) {
      return res.status(404).json({ message: 'Historique de paiement non trouvé' });
    }

    res.json({ message: 'Historique de paiement supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//mouvements stock
router.post('/stock-movements', async (req, res) => {
  try {
    const { product, in: stockIn, out: stockOut, dt_time, description } = req.body;

    const movement = new StockMovement({
      product,
      in: stockIn || 0,
      out: stockOut || 0,
      dt_time,
      description
    });

    const savedMovement = await movement.save();

    res.status(201).json(savedMovement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/stock-movements', async (req, res) => {
  try {
    const movements = await StockMovement
      .find()
      .populate('product');

    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stock-movements/:id', async (req, res) => {
  try {
    const movement = await StockMovement
      .findById(req.params.id)
      .populate('product');

    if (!movement) {
      return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
    }

    res.json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/stock-movements/:id', async (req, res) => {
  try {
    const updatedMovement = await StockMovement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product');

    if (!updatedMovement) {
      return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
    }

    res.json(updatedMovement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/stock-movements/:id', async (req, res) => {
  try {
    const deletedMovement = await StockMovement.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMovement) {
      return res.status(404).json({ message: 'Mouvement de stock non trouvé' });
    }

    res.json({ message: 'Mouvement de stock supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//users
router.post('/users', async (req, res) => {
  try {
    const { name, mail, password, role } = req.body;

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      mail,
      password: hashedPassword,
      role
    });

    const savedUser = await user.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    // si password modifié → re-hash
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
