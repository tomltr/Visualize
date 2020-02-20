const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// using body parser to parse request
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.json());


// Routing from different routes

const users_routes = require('./routes/users');
const product_routes = require('./routes/product');
const cart_routes = require('./routes/cart');
const order_routes = require('./routes/order');

app.use(users_routes);
app.use(product_routes);
app.use(cart_routes);
app.use(order_routes);

app.use(express.static(path.join(__dirname, 'public')));
if (true) {
    app.use(express.static('build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });

}

const http = require('http');

const port = (process.env.PORT || '5010');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

