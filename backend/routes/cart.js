const express = require('express');
const router = express.Router();
const authenticated = require('../util/authentication').authenticated;
const cart_controller = require('../controllers/cart');

router.post('/add-to-cart', authenticated, cart_controller.post_add_to_cart);
router.get('/cart', authenticated, cart_controller.get_cart);
router.post('/cart', authenticated, cart_controller.post_cart);

module.exports = router;