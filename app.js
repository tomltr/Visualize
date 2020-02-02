const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const config = require('./config/default.json');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const pool = require('./util/database');

const app = express();
app.use(cookie_parser());

// Salt Hashing password
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = 3000;

// Using EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

const public_images = "./public/imgs";

app.use(body_parser.urlencoded({ extended: false }));
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


// Authentication
const authenticated = ((req, res, next) => {

    const token = req.cookies['token'];
    if (token === undefined) {
        res.redirect('/login');
    }

    else {
        try {
            const decoded = jwt.verify(token, config.secretKey);

            req.user = decoded;
            next();
        }
        catch (err) {
            console.log(`404 -> Invalid token`)
        }
    }
});

const unauthenticated = ((req, res, next) => {
    const token = req.cookies['token'];
    if (token === undefined) {
        next();
    }
    else {
        res.redirect('/');
    }

})


// Home Page listing all products
app.get('/', (req, res, next) => {

    const current_user = req.cookies['user_id'];
    pool.query('SELECT * FROM products', (error, result) => {
        if (error) throw error;
        res.render('index', {
            products: result.rows,
            page_title: 'Home',
            current_user: current_user
        });
    });
});


// Adding Product Page
app.get('/add-product', authenticated, (req, res, next) => {
    res.render('add-product',
        {
            page_title: 'Add Product'
        });
});


// Submitting new product
app.post('/add-product', (req, res, next) => {

    const artist_id = req.cookies['user_id'];
    const product_title = req.body.title;
    const price = req.body.price;
    const image_path = req.file.path.split('\\')[2];

    req.file.size += 10000;

    pool.query('INSERT INTO products (artist_id, product_title, price, image_path) VALUES ($1, $2, $3, $4)', [artist_id, product_title, price, image_path], (error, result) => {
        if (error) throw error;
        res.redirect('/');
    });

});

// add item to cart upon clicking the button
app.post('/add-to-cart', authenticated, (req, res, next) => {


    // check if a cart exist with the current user
    let cart_id = req.cookies['cart_id'];

    if (cart_id) {
        console.log('Cart existed');
    }
    else {
        console.log('No cart existed');
        cart_id = uuidv4();
        pool.query('INSERT INTO cart (cart_id, user_id) VALUES ($1, $2)', [cart_id, req.cookies['user_id']], (error, result) => {
            if (error) throw error;
            //console.log(result);
        });
        res.cookie('cart_id', cart_id);
    }

    const cart_item_title = req.body.cart_item_title;
    const cart_item_image_path = req.body.cart_item_image_path;
    const cart_item_price = req.body.cart_item_price;

    let found_item;

    pool.query('SELECT * FROM cart_item WHERE cart_item.cart_item_name=$1', [cart_item_title], (error, result) => {
        if (error) throw error;

        // update found_item if item already existed
        console.log(`rowCount: ${result.rowCount}`);
        if (result.rowCount === 1) {
            found_item = result.rows[0].cart_item_id;
            console.log(`found_item ${found_item}`);
        }

        // if item already in cart, increase quantity by one
        if (found_item) {
            pool.query('UPDATE cart_item SET quantity=quantity + 1.00 WHERE cart_item_id=$1', [found_item], (another_error, another_result) => {
                if (another_error) throw another_error;
            });
        }
        // add new item to cart
        else {
            const new_quantity = 1;
            pool.query('INSERT INTO cart_item (cart_item_name, cart_item_image, price, quantity, cart_id) VALUES($1, $2, $3, $4, $5)', [cart_item_title, cart_item_image_path, parseFloat(cart_item_price), new_quantity, cart_id], (error, result) => {
                if (error) throw error;
            });

        }
    });
    res.redirect('/');
});

// Visiting Login
app.get('/login', unauthenticated, (req, res, next) => {
    res.render('login',
        {
            page_title: 'Login'
        });
});

// Logging in submission
app.post('/login', async (req, res, next) => {
    const username = req.body.username;

    const request_data = await pool.query(`SELECT * FROM users WHERE users.username = '${username}'`);
    const confirmed_data = await (request_data);

    if (confirmed_data.rows[0] === undefined) {
        res.render('login', {
            page_title: 'Login',
            error: 'username'
        });
    }
    else {
        await bcrypt.compare(req.body.password, confirmed_data.rows[0].password, (err, result) => {
            if (!result) {
                res.render('login', {
                    page_title: 'Login',
                    error: 'password'
                });
            }
            else {
                jwt.sign(
                    { id: confirmed_data.rows[0].user_id },
                    config.secretKey,
                    (err, token) => {
                        if (err) throw err;
                        res.cookie('token', token);
                        res.cookie('user_id', confirmed_data.rows[0].user_id);
                        res.redirect('/');
                    }
                );
            }
        });
    }
});

app.get('/logout', authenticated, (req, res, next) => {
    res.clearCookie('token');
    res.clearCookie('user_id');
    res.redirect('/');

})

// Visiting Register page
app.get('/register', unauthenticated, (req, res, next) => {
    res.render('register',
        {
            page_title: 'Register'
        });
});

// After registration submission
app.post('/register', (req, res, next) => {
    const full_name = req.body.full_name;
    const address = req.body.address;
    const phone_number = req.body.phone_number;
    const username = req.body.username;
    const email = req.body.email;
    bcrypt.hash(req.body.password, saltRounds, (err, hashed_password) => {
        if (err) {
            throw (err);
        }
        else {

            pool.query('INSERT INTO users ( full_name, address, phone_number, username, email, password) VALUES ($1, $2, $3, $4, $5, $6)', [full_name, address, phone_number, username, email, hashed_password], (error, results) => {
                if (error) {
                    console.log(error);
                }
                res.redirect('/');
            });
        }
    });

});

app.get('/invalid-request', (req, res) => {
    res.render('400',
        {
            page_title: 'Page Not Found'
        });
});


app.listen(port);