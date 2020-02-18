const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(cookie_parser());

const port = 5000;

// Using EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

// using body parser to parse request
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

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