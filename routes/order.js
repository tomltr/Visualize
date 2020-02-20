const express = require('express');
const router = express.Router();
const orders_controller = require('../controllers/order');

router.post('/order_form', orders_controller.post_order_form);
router.get('/orders', orders_controller.get_orders);
router.get('/order/:id', orders_controller.get_order_by_id);

module.exports = router;
