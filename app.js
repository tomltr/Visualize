const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const uuidv4 = require('uuid/v4');

const app = express();
app.use(cookie_parser());

const port = 3000;

// Using EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

// using body parser to parse request
app.use(body_parser.urlencoded({ extended: false }));

// using multer to upload images
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
        callback(null, false);
    }
}

const multer_object =
{
    storage: storage,
    fileFilter: image_filter,
    limits:
    {
        fileSize: 1 * 1024 * 1024
    }
};
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer(multer_object).single('image'));

// Routing from different routes

const users_routes = require('./routes/users');
const product_routes = require('./routes/product');
const cart_routes = require('./routes/cart');
const order_routes = require('./routes/order');

app.use(users_routes);
app.use(product_routes);
app.use(cart_routes);
app.use(order_routes);

app.get('/invalid-request', (req, res) => {
    const current_user = req.cookies['user_id'];
    res.render('400',
        {
            page_title: 'Page Not Found',
            current_user: current_user
        });
});

app.listen(port);