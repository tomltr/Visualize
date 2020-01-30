const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const path = require('path');
const config = require('./config/default.json');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookie_parser());

// Salt Hashing password
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = 3000;

// Using EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(body_parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Creating a pool connection from postgresql
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres_user',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 'your port'
});

// Authentication
const authenticated = ((req, res, next) => {

    const token = req.cookies['token'];
    //console.log(`authenticated: ${token}`);
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
    //console.log(`unathenticated: ${token}`);
    if (token === undefined) {
        // console.log('good to go');
        next();
    }
    else {
        res.redirect('/');
    }

})


// Home Page
app.get('/', (req, res, next) => {
    res.render('index',
        {
            page_title: 'Home'
        });
});

// Adding Product Page
app.get('/add-product', authenticated, (req, res, next) => {
    //console.log(`in add-product: ${req.get('Cookie')}`);
    res.render('add-product',
        {
            page_title: 'Add Product'
        });
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
        //console.log(`not found: ${username}`);
        res.render('login', {
            page_title: 'Login',
            error: 'username'
        });
    }
    else {
        await bcrypt.compare(req.body.password, confirmed_data.rows[0].password, (err, result) => {
            if (!result) {
                //console.log(`password ${req.body.password} is invalid!`);
                res.render('login', {
                    page_title: 'Login',
                    error: 'password'
                });
            }
            else {
                //console.log(`logging in successfully!`);
                jwt.sign(
                    { id: confirmed_data.rows[0].user_id },
                    config.secretKey,
                    (err, token) => {
                        if (err) throw err;
                        res.cookie('token', token);
                        res.redirect('/');
                    }
                );
            }
        });
    }
});

app.get('/logout', authenticated, (req, res, next) => {
    res.setHeader('Set-Cookie', 'token=; max-age=0');
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
                console.log(results);
                res.redirect('/login');
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

app.use('/', (req, res, next) => {
    res.redirect('invalid-request');
})

app.listen(port);