const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product');

router.get('/products', product_controller.get_products);
router.post('/add-product', product_controller.post_add_product);
router.get('/product/:id', product_controller.get_product);

module.exports = router;
