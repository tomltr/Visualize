const db = require('../util/database');

module.exports = class Cart {
    constructor(cart_id, user_id) {
        this.cart_id = cart_id;
        this.user_id = user_id;
    }

    //  add to cart POST
    add_cart() {
        return db.query('INSERT INTO cart (cart_id, user_id) VALUES ($1, $2)', [this.cart_id, this.user_id]);
    };

    static get_cart_item_from_product_id(product_id) {
        return db.query('SELECT * FROM cart_item WHERE product_id=$1', [product_id]);
    }

    static increment_cart_item(cart_item_id) {
        return db.query('UPDATE cart_item SET quantity=quantity + 1 WHERE cart_item_id=$1', [cart_item_id]);
    }

    static add_cart_item(product_id, quantity, cart_id) {
        return db.query('INSERT INTO cart_item (product_id, quantity, cart_id) VALUES($1, $2, $3)', [product_id, quantity, cart_id]);
    }

    // cart POST - update cart item
    static update_cart_item(quantity, product_id) {
        return db.query('UPDATE cart_item SET quantity=$1 WHERE product_id=$2', [quantity, product_id]);
    };

    // cart GET - get cart items
    static get_cart(user_id) {
        return db.query('SELECT * FROM cart WHERE user_id=$1', [user_id]);
    }

    static get_cart_items(cart_id) {
        return db.query('SELECT cart_id, cart_item.product_id, product_title, price, image_path, quantity FROM cart_item, product WHERE cart_item.cart_id = $1 AND cart_item.product_id = product.product_id', [cart_id]);
    }

    // Other

    static get_cart_item_from_cart_id(cart_id) {
        return db.query('SELECT * FROM cart_item WHERE cart_id=$1', [cart_id]);
    }

    static get_cart_from_user_id(user_id) {
        return db.query('SELECT * FROM cart WHERE user_id=$1', [user_id]);
    }

    static get_cart_item_detailed(cart_id) {
        return db.query('SELECT * FROM cart_item, product WHERE cart_id=$1 AND cart_item.product_id = product.product_id', [cart_id]);
    }

    static delete_cart(cart_id) {
        return db.query('DELETE FROM cart WHERE cart_id=$1', [cart_id]);
    }
}