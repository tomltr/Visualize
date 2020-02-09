const Cart = require('../models/cart');
const uuidv4 = require('uuid/v4');

exports.post_add_to_cart = (req, res, next) => {

    const current_user = req.body.current_user;
    let cart_id = req.cookies['cart_id'];

    // if cart not exist
    if (!cart_id) {
        cart_id = uuidv4();
        const cart = new Cart(cart_id, current_user);
        cart.add_cart()
            .catch((error) => {
                if (error) throw error;
            });
        res.cookie('cart_id', cart_id);
    }

    const product_id = req.body.product_id;

    // finding added item in cart
    let found_item;
    Cart.get_cart_item_from_product_id(product_id)
        .then((result) => {
            if (result.rowCount === 1) {
                found_item = result.rows[0].cart_item_id;
            }

            // if item already in cart, increase quantity by one
            if (found_item) {
                Cart.increment_cart_item(cart_item_id)
                    .catch((error) => {
                        if (error) throw error;
                    });
            }
            // add new item to cart
            else {
                const new_quantity = 1;
                Cart.add_cart_item(product_id, new_quantity, cart_id)
                    .catch((error) => {
                        if (error) throw error;
                    });
            }
        })
        .catch((error) => {
            if (error) throw error;
        });
    res.redirect('back');

}

exports.post_cart = (req, res, next) => {
    const updated_quantity = req.body.cart_item_quantity;
    const product_id = req.body.product_id;

    Cart.update_cart_item(updated_quantity, product_id)
        .then(() => {
            res.redirect('/cart');
        })
        .catch((error) => {
            if (error) throw error;
        });

}

exports.get_cart = (req, res, next) => {
    const current_user = req.cookies['user_id'];

    // check if cart exist
    let cart_id;
    Cart.get_cart(current_user)
        .then((result) => {
            if (result.rowCount > 0) {
                cart_id = result.rows[0].cart_id;
            };

            let cart_exist;
            let total = 0.00;

            // if cart exists get total and render cart items
            if (cart_id) {
                cart_exist = true;
                Cart.get_cart_items(cart_id)
                    .then((result_item) => {
                        for (let i = 0; i < result_item.rowCount; ++i) {
                            total += result_item.rows[i].price * result_item.rows[i].quantity;
                        }
                        res.render('cart',
                            {
                                cart_exist: cart_exist,
                                cart_items: result_item.rows,
                                page_title: 'Cart',
                                current_user: current_user,
                                total: parseFloat(total).toFixed(2)
                            });
                    })
                    .catch((item_error) => {
                        if (item_error) {
                            throw item_error;
                        }
                    })
            }

            // render empty cart
            else {
                res.render('cart',
                    {
                        page_title: 'Cart',
                        cart_exist: cart_exist,
                        total: parseFloat(total).toFixed(2),
                        current_user: current_user
                    });
            }
        })
        .catch((error) => {
            if (error) throw error;
        });
}
