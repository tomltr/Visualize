const express = require('express');
const body_parser = require('body-parser');
const path = require('path');

const app = express();

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
    user: '<user>',
    host: '<host>',
    database: '<database>',
    password: '<password',
    port: '<port>'
});

// Home Page
app.get('/', (req, res, next) => {
    res.render('index',
        {
            page_title: 'Home'
        });
});

// Adding Product Page
app.get('/add-product', (req, res, next) => {
    res.render('add-product',
        {
            page_title: 'Add Product'
        });
});

// Visiting Login
app.get('/login', (req, res, next) => {
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
        console.log(`not found: ${username}`);
        res.render('login', {
            page_title: 'Login',
            error: 'username'
        });
    }
    else {
        await bcrypt.compare(req.body.password, confirmed_data.rows[0].password, (err, result) => {
            if (!result) {
                console.log(`password ${req.body.password} is invalid!`);
                res.render('login', {
                    page_title: 'Login',
                    error: 'password'
                });
            }
            else {
                console.log(`logging in successfully!`);
                res.redirect('/');
            }
        });
    }
});

// Visiting Register page
app.get('/register', (req, res, next) => {
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
                res.redirect('/');
            });
        }
    });

})

app.listen(port);