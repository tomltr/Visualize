const Product = require('../models/product');
const db = require('../util/database');

exports.get_products = (req, res, next) => {
    const current_user = req.cookies['user_id'];
    res.cookie('user_id', JSON.stringify({ key: current_user }));
    Product.get_products()
        .then(result => {
            res.json(result.rows);
        })
        .catch((error) => {
            throw error;
        });
}

exports.get_product = (req, res, next) => {
    const current_user = req.cookies['user_id'];

    const id = req.params.id;
    Product.get_product(id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            if (error) {
                throw error;
            }
        });
}

exports.get_add_product = (req, res, next) => {
    const current_user = req.cookies['user_id'];
    res.render('add-product',
        {
            page_title: 'Add Product',
            current_user: current_user
        });
};

exports.post_add_product = (req, res, next) => {
    const artist_id = req.body.artist_id;
    const product_title = req.body.title;
    const price = req.body.price;
    const image_path = req.file.path.split('\\')[2];

    const product = new Product(artist_id, product_title, price, image_path);
    product.add_product()
        .then(result => {
            res.json(result.rows);
        })
        .catch((error) => {
            if (error) {
                throw error;
            }
        });

}
