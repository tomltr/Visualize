const Cart = require('../models/cart');
const uuidv4 = require('uuid/v4');

exports.post_add_to_cart = (req, res, next) => {

    const current_user = req.body.current_user;
    let cart_id = req.body.cart_id;

    // if cart not exist
    if (cart_id === '') {
        cart_id = uuidv4();
        const cart = new Cart(cart_id, current_user);
        cart.add_cart()
            .then(() => {
                const product_id = req.body.product_id;

                // finding added item in cart
                let found_item;
                Cart.get_cart_item_from_product_id(cart_id, product_id)
                    .then(result => {
                        if (result.rowCount === 1) {
                            found_item = result.rows[0].cart_item_id;
                        }
                        // if item already in cart, increase quantity by one
                        if (found_item) {
                            Cart.increment_cart_item(found_item)
                                .then(() => {
                                    res.json(cart_id);
                                })
                                .catch(increment_error => {
                                    if (increment_error) throw increment_error;
                                });
                        }
                        // add new item to cart
                        else {
                            const new_quantity = 1;
                            Cart.add_cart_item(product_id, new_quantity, cart_id)
                                .then(() => {
                                    res.json(cart_id);
                                })
                                .catch(add_item_error => {
                                    if (add_item_error) throw add_item_error;
                                });
                        }
                    })
                    .catch(result_error => {
                        if (result_error) throw result_error;
                    });
            })
            .catch(error => {
                if (error) throw error;
            });

    }
    else {
        const product_id = req.body.product_id;

        // finding added item in cart
        let found_item;
        Cart.get_cart_item_from_product_id(cart_id, product_id)
            .then(result => {
                if (result.rowCount === 1) {
                    found_item = result.rows[0].cart_item_id;
                }

                // if item already in cart, increase quantity by one
                if (found_item) {
                    Cart.increment_cart_item(found_item)
                        .then(result => {
                            res.json(cart_id);
                        })
                        .catch(increment_error => {
                            if (increment_error) throw increment_error;
                        });
                }
                // add new item to cart
                else {
                    const new_quantity = 1;
                    Cart.add_cart_item(product_id, new_quantity, cart_id)
                        .then(() => {
                            res.json(cart_id);
                        })
                        .catch(add_item_error => {
                            if (add_item_error) throw add_item_error;
                        });
                }
            })
            .catch(error => {
                if (error) throw error;
            });
    }

}

exports.post_cart = (req, res, next) => {
    const updated_quantity = req.body.cart_item_quantity;
    const product_id = req.body.product_id;
    const cart_item_id = req.body.cart_item_id;

    Cart.update_cart_item(updated_quantity, product_id, cart_item_id)
        .then(result => {
            res.json(result);
        })
        .catch((error) => {
            if (error) throw error;
        });

}

exports.get_cart = (req, res, next) => {
    const current_user = req.query.current_user;

    // check if cart exist
    let cart_id = req.query.cart_id;
    Cart.get_cart(current_user)
        .then((result) => {
            if (result.rowCount > 0) {
                cart_id = result.rows[0].cart_id;
            };
            let total = 0.00;

            // if cart exists get total and render cart items
            let cart = {};
            if (cart_id !== '') {
                Cart.get_cart_items(cart_id)
                    .then((result_item) => {
                        for (let i = 0; i < result_item.rowCount; ++i) {
                            total += result_item.rows[i].price * result_item.rows[i].quantity;
                        }
                        cart.cart_items = result_item.rows;
                        cart.cart_id = cart_id;
                        cart.total = parseFloat(total).toFixed(2);
                        res.json(cart);
                    })
                    .catch((item_error) => {
                        if (item_error) {
                            throw item_error;
                        }
                    })
            }

            // render empty cart
            else {
                cart.cart_items = [];
                cart.cart_id = cart_id;
                cart.total = parseFloat(0).toFixed(2);
                res.json(cart);
            }
        })
        .catch((error) => {
            if (error) throw error;
        });
}

exports.delete_cart_item = (req, res, next) => {
    const cart_item_id = req.params.id;

    Cart.delete_cart_item(cart_item_id)
        .then(result => {
            res.json('Item deleted');
        })
        .catch(error => {
            if (error) throw error;
        });

}
