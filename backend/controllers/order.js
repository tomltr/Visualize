const Cart = require('../models/cart');
const Order = require('../models/order');
const uuidv4 = require('uuid/v4');

exports.get_order_form = (req, res, next) => {
    const id = req.cookies['user_id'];

    // get user's cart then display its items in an order form
    Cart.get_cart_from_user_id(id)
        .then(result => {
            const cart_id = result.rows[0].cart_id;

            Cart.get_cart_item_detailed(cart_id)
                .then(cart_result => {
                    let total = 0;
                    for (let i = 0; i < cart_result.rowCount; ++i) {
                        total += cart_result.rows[i].price * cart_result.rows[i].quantity;
                    }

                    res.render('order_form', {
                        page_title: 'Order Form',
                        cart_items: cart_result.rows,
                        total: parseFloat(total).toFixed(2),
                        current_user: id
                    })

                })
                .catch(cart_error => {
                    if (cart_error) throw cart_error;
                });
        })
        .catch(error => {
            if (error) throw error;
        })

}
exports.post_order_form = (req, res, next) => {

    const user_id = req.body.user;
    const payment_method = req.body.payment_method;
    const card_number = req.body.credit_card_number;
    const total = req.body.total;
    const cart_id = req.body.cart_id;

    // add a new order
    const order_id = uuidv4();
    const order = new Order(order_id, user_id, payment_method, card_number, total);
    order.add_order()

        // add order items from cart items
        .then(() => {
            Cart.get_cart_item_from_cart_id(cart_id)
                .then(cart_item_result => {
                    for (let i = 0; i < cart_item_result.rowCount; ++i) {
                        let item_product_id = cart_item_result.rows[i].product_id;
                        let item_quantity = cart_item_result.rows[i].quantity;
                        Order.add_order_item(order_id, item_product_id, item_quantity, "PURCHASED")
                            .catch(order_item_error => {
                                if (order_item_error) throw order_item_error;
                            });
                    }
                    // delete cart and clear cart cookie after adding all cart items
                    Cart.delete_cart(cart_id)
                        .then(() => {
                            res.clearCookie('cart_id');
                            res.redirect('/orders');
                        })
                        .catch(cart_error => {
                            if (cart_error) throw cart_error;
                        });
                })
                .catch(cart_item_error => {
                    if (cart_item_error) throw cart_item_error;
                });
        })
        .catch(error => {
            if (error) throw error;
        });

};

exports.get_orders = (req, res, next) => {
    const current_user = req.cookies['user_id'];

    Order.get_orders(current_user)
        .then(result => {
            res.render('orders',
                {
                    page_title: 'Order',
                    orders: result.rows,
                    current_user: current_user
                });
        })
        .catch(error => {
            if (error) throw error;
        });

}
exports.get_order_by_id = (req, res, next) => {
    const order_id = req.params.id;
    const current_user = req.cookies['user_id'];

    let total;

    // get total from an order for rendering
    Order.get_total_from_order(order_id)
        .then(result => {
            total = result.rows[0].total;
        })
        .catch(error => {
            if (error) throw error;
        });

    // listing order items from an order
    Order.get_order_items(order_id)
        .then((result) => {
            res.render('order_detail',
                {
                    page_title: 'Order Detail',
                    order_items: result.rows,
                    total: total,
                    current_user: current_user
                })
        })
        .catch(error => {
            if (error) throw error;
        });

}