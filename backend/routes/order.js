const express = require('express');
const router = express.Router();
const authenticated = require('../util/authentication').authenticated;
const orders_controller = require('../controllers/order');

router.get('/order_form', authenticated, orders_controller.get_order_form);
router.post('/order_form', authenticated, orders_controller.post_order_form);
router.get('/orders', authenticated, orders_controller.get_orders);
router.get('/order/:id', authenticated, orders_controller.get_order_by_id);

module.exports = router;