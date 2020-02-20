const Product = require('../models/product');
const multer = require('multer');
const uuidv4 = require('uuid');

exports.get_products = (req, res, next) => {
    Product.get_products()
        .then(result => {
            res.json(result.rows);
        })
        .catch((error) => {
            throw error;
        });
}

exports.get_product = (req, res, next) => {

    const id = req.params.id;
    Product.get_product(id)
        .then(result => {
            res.json(result.rows);
        })
        .catch((error) => {
            if (error) {
                throw error;
            }
        });
}

const public_images = "./public/imgs";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, public_images);
    },
    filename: (req, file, callback) => {
        callback(null, uuidv4() + '.' + file.mimetype.split("/")[1]);
    }
});

const image_filter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    }
    else {
        callback(new Error('Only image(png, jpg, jpeg) file is acceptable'));
    }
}

const multer_object =
{
    storage: storage,
    fileFilter: image_filter,
    limits:
    {
        fileSize: 1 * 1024 * 1024
    },
};

const upload = multer(multer_object).single('productImage');
exports.post_add_product = (req, res, next) => {

    let artist_id;
    let product_title;
    let price;
    let image_path;
    let errorMessage = {};

    upload(req, res, function (err) {
        if (err) {
            errorMessage.error = err.message;
            res.json(errorMessage);
        }
        else {
            artist_id = req.body.artist_id;
            product_title = req.body.title;
            price = req.body.price;
            image_path = req.file.path.split('/')[2];
            const product = new Product(artist_id, product_title, price, image_path);
            product.add_product()
                .then(result => {
                    res.json(result.rows);
                })
                .catch(error => {
                    if (error.message.includes('title')) {
                        errorMessage.title = '** Product already exists **';
                    }
                    res.json(errorMessage);
                });
        }
    });

}

