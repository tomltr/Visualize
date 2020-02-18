const express = require('express');
const router = express.Router();
const authenticated = require('../util/authentication').authenticated;
const product_controller = require('../controllers/product');


router.get('/', product_controller.get_products);
router.get('/add-product', authenticated, product_controller.get_add_product);
router.post('/add-product', product_controller.post_add_product);
router.get('/product/:id', product_controller.get_product);

module.exports = router;