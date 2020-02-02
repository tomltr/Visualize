const db = require('../util/database');

module.exports = class Product {
    constructor(product_id, artist_id, product_title, price, image_path, date_created) {
        this.product_id = product_id;
        this.artist_id = artist_id;
        this.product_title = product_title;
        this.price = price;
        this.image_path = image_path;
        this.date_created = date_created;
    }

    static get_products() {
        return db.query('SELECT * FROM products');
    }

}