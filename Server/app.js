const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(cookie_parser());


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

if (true) {
    app.use(express.static('build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    })

}

const http = require('http');

const normalizedPort = val => {
    let port = parseInt(val, 10);
    console.log(`\n calling normalize port: type-> ${typeof port}, port: ${port}`);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        console.log(`${port} is greater than zero`);
        return port;
    }

    return false;
}

const port = normalizedPort(process.env.PORT || '5010');
console.log(`port: ${port} with type ${typeof port}`);
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

// app.get('/invalid-request', (req, res) => {
//     const current_user = req.cookies['user_id'];
//     res.render('400',
//         {
//             page_title: 'Page Not Found',
//             current_user: current_user
//         });
// });
