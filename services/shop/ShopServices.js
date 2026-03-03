const Shop = require('../../models/shop/Shop');
const Product = require('../../models/product/Product');

// Pour avoir la boutique du gestionnaire qui se connecte
async function get_shop_by_user(userId) {
    const shop = await Shop.findOne({ user: userId });
    if (!shop) {
        throw new Error("Aucune boutique associée à cet utilisateur");
    }
    return shop;
}

// Pour avoir tous les produits de la boutique 
// que le gestionnaire gere
async function get_shop_products_by_user(userId) {
    const shop = await get_shop_by_user(userId);

    return await Product.find({ shop: shop._id })
        .populate('category_product');
}


module.exports = {
  get_shop_products_by_user,
  get_shop_by_user
};