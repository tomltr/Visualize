const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = require('../config');
const db = require('../util/database');

exports.get_register_user = (req, res, next) => {
    const current_user = req.cookies['user_id'];
    res.render('register',
        {
            page_title: 'Register',
            current_user: current_user
        });
}

exports.post_register_user = (req, res, next) => {
    const full_name = req.body.fullName;
    const username = req.body.username;
    const email = req.body.email;
    const address = req.body.address;
    const phone_number = req.body.phoneNumber;
    const salt_rounds = 10;
    bcrypt.hash(req.body.password, salt_rounds, (err, hashed_password) => {
        if (err) {
            throw (err);
        }
        else {
            const user = new User(full_name, username, email, hashed_password, address, phone_number);

            user.add_user()
                .then(result => {
                    User.get_user(username)
                        .then(user_result => {
                            const registered_user = {
                                user_id: user_result.rows[0].user_id,
                            }
                            res.json(registered_user);
                            console.log(`user registered: ${user_result.rows[0].user_id}`);
                        })
                        .catch(user_error => {
                            if (user_error) {
                                throw user_error;
                            }
                        });
                })
                .catch(err => {
                    throw err;
                });
        }
    });
}

exports.get_login = (req, res, next) => {
    console.log(`calling get_login`);
    const current_user = req.cookies['user_id'];
    res.json({ 'current_user': current_user });
}

exports.post_login = async (req, res, next) => {
    console.log(`calling post_login`);
    const username = req.body.username;
    const current_user = req.cookies['user_id'];
    const request_data = await User.get_user(username);
    const confirmed_data = await (request_data);

    // If username not exists
    if (confirmed_data.rows[0] === undefined) {
        console.log(`username ${username} not exists`);
        res.json({ 'user': 'User not exists' });
    }


    // When a username is valid
    else {
        console.log(`username ${username}`);

        await bcrypt.compare(req.body.password, confirmed_data.rows[0].password, (err, result) => {

            // Wrong password
            let json_object = {};
            if (!result) {
                console.log(`invalid password: ${req.body.password}`);
                res.render('login', {
                    page_title: 'Login',
                    error: 'password',
                    current_user: current_user
                });
            }

            // Valid password, signs and adds token and user_id
            else {
                console.log(`valid password: ${req.body.password}`);
                jwt.sign(
                    { id: confirmed_data.rows[0].user_id },
                    secret_key,
                    (err, token) => {
                        if (err) throw err;
                        json_object.token = token;
                        json_object.user_id = confirmed_data.rows[0].user_id;
                        res.json(json_object);
                    }
                );
            }
        });
    }
}

exports.get_logout = (req, res, next) => {
    res.clearCookie('token');
    res.clearCookie('user_id');
    res.redirect('/');
}