const express = require('express');
const router = express.Router();
const Product = require('../../models/product/Product');
const CategoryProduct = require('../../models/product/CategoryProduct');
const shopService = require('../../services/shop/ShopServices');


// Avoir les produits de la boutique du gestionnaire
router.get('/shop/products', async (req, res) => {
    try {
        const products = await shopService.get_shop_products_by_user(req.body.idUser);
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Creation d'un produit d'une boutique que le gestionnaire gere 
router.post('/shop/products', async (req, res) => {
    try {
        const shopUser = await shopService.get_shop_by_user(req.body.idUser);
        const { name, price, shop, category_product } = req.body;

        const product = new Product({
        name,
        price,
        shop: shopUser._id,
        category_product
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/products', async (req, res) => {
    try {
        const { name, price, shop, category_product } = req.body;

        const product = new Product({
        name,
        price,
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


module.exports = router;