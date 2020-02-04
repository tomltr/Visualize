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

// Go to Cart
app.get('/cart', authenticated, (req, res, next) => {
    //const cart_id = req.cookies['cart_id'];
    const current_user = req.cookies['user_id'];
    let cart_id;
    pool.query('SELECT * FROM cart WHERE user_id=$1', [current_user], (error, result) => {
        if (error) throw error;
        if (result.rowCount > 0) {
            cart_id = result.rows[0].cart_id;
        };

        let cart_exist;
        let total = 0.00;
        if (cart_id) {
            cart_exist = true;
            pool.query('SELECT cart_id, cart_item.product_id, product_title, price, image_path, quantity FROM cart_item, products WHERE cart_item.cart_id = $1 AND cart_item.product_id = products.product_id;', [cart_id], (error_item, result_item) => {
                if (error_item) throw error_item;
                const cart_items = result_item.rows;
                for (let i = 0; i < result_item.rowCount; ++i) {
                    total += result_item.rows[i].price * result_item.rows[i].quantity;
                }
                console.log(`current_user: ${current_user}`);

                res.render('cart',
                    {
                        cart_exist: cart_exist,
                        cart_items: result_item.rows,
                        page_title: 'Cart',
                        current_user: current_user,
                        total: parseFloat(total).toFixed(2)
                    });
            });
        }
        else {
            res.render('cart',
                {
                    page_title: 'Cart',
                    cart_exist: cart_exist,
                    total: parseFloat(total).toFixed(2)
                });
        }
    });
});

app.post('/cart', (req, res, next) => {
    const updated_quantity = req.body.cart_item_quantity;
    const product_id = req.body.product_id;
    console.log(`user: ${req.body.current_user}`);
    console.log(`product_id: ${product_id}`);
    // console.log(`updated_quantity for ${req.body.cart_item_title}: ${updated_quantity}`);
    pool.query('UPDATE cart_item SET quantity=$1 WHERE product_id=$2', [updated_quantity, product_id], (error, result) => {
        if (error) throw error;
        res.redirect('/cart');
    });
});

app.get('/order_form', authenticated, (req, res, next) => {
    const id = req.cookies['user_id'];

    pool.query('SELECT * FROM cart WHERE user_id=$1', [id], (error, result) => {
        if (error) throw error;

        const cart_id = result.rows[0].cart_id;

        pool.query('SELECT * FROM cart_item WHERE cart_id=$1', [cart_id], (cart_error, cart_result) => {
            if (cart_error) throw cart_error;

            let total = 0;
            for (let i = 0; i < cart_result.rowCount; ++i) {
                total += cart_result.rows[i].price * cart_result.rows[i].quantity;
            }
            res.render('order_form', {
                page_title: 'Order Form',
                cart_items: cart_result.rows,
                total: parseFloat(total).toFixed(2),
                current_user: id

            });
        });
    });
});

app.post('/order_form', (req, res, next) => {
    console.log(`user post order_form: ${req.body.user}`);
    console.log(`cart_id: ${req.body.cart_id}`);
    console.log(`payment_method: ${req.body.payment_method}`);
    console.log(`card_number: ${req.body.credit_card_number}`);
    console.log(`total: ${req.body.total}`);

    const user_id = req.body.user;
    const payment_method = req.body.payment_method;
    const card_number = req.body.credit_card_number;
    const total = req.body.total;
    const cart_id = req.body.cart_id;


    pool.query('INSERT INTO orders (user_id, payment_method, card_number, total) VALUES($1, $2, $3, $4)', [user_id, payment_method, card_number, total],
        (error, result) => {
            if (error) throw error;

            // pool.query('SELECT * FROM cart_item WHERE cart_id=$1', [cart_id], (cart_error, cart_result) =>
            // {
            //     if (cart_error) throw cart_error;

            //     for(let i = 0; i < cart_result.rowCount; ++i)
            //     {
            //         pool.query('INSERT INTO order_item (order_id, product_id, ')
            //     }
            // });

            // pool.query('DELETE FROM cart WHERE cart_id=$1', [cart_id], (cart_error, cart_result) => {
            //     if (cart_error) throw error;
            //     res.redirect('/orders');

            // });
        });


});

app.get('/orders/:id', (req, res, next) => {
    const user_id = req.params.id;

    pool.query('SELECT * FROM orders WHERE order_id=$1 ORDER BY date_created', [user_id], (error, result) => {
        if (error) throw error;
        res.render('order',
            {
                orders: result.rows,
                page_title: 'Orders'
            });
    });
});

app.get('/products/:id', (req, res, next) => {

    console.log(`id: ${req.params.id}`);
    const current_user = req.cookies['user_id'];
    console.log(`user_id: ${current_user}`);

    const id = req.params.id;
    pool.query('SELECT * FROM products WHERE product_id = $1', [id], (error, result) => {
        if (error) throw error;

        const product_exists = (result.rowCount > 0) ? true : false;
        res.render('product-info', {
            current_user: current_user,
            product_exists: product_exists,
            page_title: result.rows[0].product_title,
            product: result.rows[0]

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

    pool.query('INSERT INTO products (artist_id, product_title, price, image_path) VALUES ($1, $2, $3, $4)', [artist_id, product_title, price, image_path], (error, result) => {
        if (error) throw error;
        res.redirect('/');
    });

});

// add item to cart upon clicking the button
app.post('/add-to-cart', authenticated, (req, res, next) => {


    // check if a cart exist with the current user
    const current_user = req.body.current_user;
    let cart_id = req.cookies['cart_id'];

    if (cart_id) {
        console.log('Cart existed');
    }
    else {
        console.log('No cart existed');
        cart_id = uuidv4();
        pool.query('INSERT INTO cart (cart_id, user_id) VALUES ($1, $2)', [cart_id, current_user], (error, result) => {
            if (error) throw error;
            //console.log(result);
        });
        res.cookie('cart_id', cart_id);
    }

    const product_id = req.body.product_id;
    console.log(`user: ${current_user}`);
    console.log(`cart_id: ${cart_id}`);
    console.log(`product_id: ${product_id}`);

    let found_item;

    pool.query('SELECT * FROM cart_item WHERE product_id=$1', [product_id], (error, result) => {
        if (error) throw error;

        // update found_item if item already existed
        console.log(`rowCount: ${result.rowCount}`);
        if (result.rowCount === 1) {
            found_item = result.rows[0].cart_item_id;
            console.log(`found_item ${found_item}`);
        }

        // if item already in cart, increase quantity by one
        if (found_item) {
            pool.query('UPDATE cart_item SET quantity=quantity + 1 WHERE cart_item_id=$1', [found_item], (another_error, another_result) => {
                if (another_error) throw another_error;
            });
        }
        // add new item to cart
        else {
            const new_quantity = 1;
            pool.query('INSERT INTO cart_item (product_id, quantity, cart_id) VALUES($1, $2, $3)', [product_id, new_quantity, cart_id], (error, result) => {
                if (error) throw error;
            });

        }
    });
    res.redirect('back');
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