const Cart = require('../models/cart');
const Order = require('../models/order');
const uuidv4 = require('uuid/v4');

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
                            res.json('Order Submitted');
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

    const current_user = req.query.current_user;
    Order.get_orders(current_user)
        .then(result => {
            res.json(result.rows);
        })
        .catch(error => {
            if (error) throw error;
        });

}
exports.get_order_by_id = (req, res, next) => {
    const order_id = req.params.id;

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
        .then(result => {
            res.json(result.rows);
        })
        .catch(error => {
            if (error) throw error;
        });
}
