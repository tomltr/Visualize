const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = require('../config');

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
                        })
                        .catch(user_error => {
                            if (user_error) {
                                throw user_error;
                            }
                        });
                })
                .catch(err => {
                    if (err) {
                        let error_message = {};
                        if (err.message.includes('email')) {
                            error_message.email = '** email already exists **';
                        }
                        else if (err.message.includes('username')) {
                            error_message.username = '** username already exists **';
                        }
                        res.json(error_message);

                    }
                });
        }
    });
}

exports.get_login = (req, res, next) => {
    const current_user = req.cookies['user_id'];
    res.json({ 'current_user': current_user });
}

exports.post_login = async (req, res, next) => {
    const username = req.body.username;
    const request_data = await User.get_user(username);
    const confirmed_data = await (request_data);

    // If username not exists
    let json_object = {};
    if (confirmed_data.rows[0] === undefined) {
        json_object.user_error = 'User does not exists';
        res.json(json_object);
    }


    // When a username is valid
    else {

        await bcrypt.compare(req.body.password, confirmed_data.rows[0].password, (err, result) => {

            // Wrong password
            if (!result) {
                json_object.error = 'invalid username/password';
                res.json(json_object);
            }

            // Valid password, signs and adds token and user_id
            else {
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

