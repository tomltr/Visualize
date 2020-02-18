const express = require('express');
const router = express.Router();
const cart_controller = require('../controllers/cart');

router.post('/add-to-cart', cart_controller.post_add_to_cart);
router.get('/cart', cart_controller.get_cart);
router.post('/cart', cart_controller.post_cart);
router.post('/delete-cart-item/:id', cart_controller.delete_cart_item);

module.exports = router;