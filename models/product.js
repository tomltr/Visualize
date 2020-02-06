const db = require('../util/database');

module.exports = class Product {
    constructor(artist_id, product_title, price, image_path) {
        this.artist_id = artist_id;
        this.product_title = product_title;
        this.price = price;
        this.image_path = image_path;
    }

    add_product() {
        return db.query('INSERT INTO product (artist_id, product_title, price, image_path) VALUES($1, $2, $3, $4)', [this.artist_id, this.product_title, this.price, this.image_path]);
    }

    static get_product(id) {
        return db.query('SELECT * FROM product WHERE product_id=$1', [id]);
    }

    static get_products() {
        return db.query('SELECT * FROM product');
    }

}