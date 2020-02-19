const db = require('../util/database');

module.exports = class Order {
    constructor(order_id, user_id, payment_method, card_number, total) {
        this.order_id = order_id;
        this.user_id = user_id;
        this.payment_method = payment_method;
        this.card_number = card_number;
        this.total = total;
    }

    // post order_form
    add_order() {
        return db.query('INSERT INTO orders (order_id, user_id, payment_method, card_number, total) VALUES($1, $2, $3, $4, $5)', [this.order_id, this.user_id, this.payment_method, this.card_number, this.total]);
    }

    static add_order_item(order_id, item_product_id, item_quantity, status) {
        return db.query('INSERT INTO order_item (order_id, product_id, quantity, status) VALUES($1, $2, $3, $4)', [order_id, item_product_id, item_quantity, status]);
    }

    // get orders
    static get_orders(current_user) {
        return db.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY date_created DESC', [current_user]);
    }

    // get order by id
    static get_total_from_order(order_id) {
        return db.query('SELECT total FROM orders WHERE order_id = $1', [order_id]);
    }

    static get_order_items(order_id) {
        return db.query('SELECT * FROM order_item, product WHERE order_item.order_id = $1 AND order_item.product_id= product.product_id', [order_id]);
    }
}