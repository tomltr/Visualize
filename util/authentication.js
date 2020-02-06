const jwt = require('jsonwebtoken');
const secret_key = require('../config');

exports.authenticated = ((req, res, next) => {

    const token = req.cookies['token'];
    if (token === undefined) {
        res.redirect('/login');
    }

    else {
        try {
            const decoded = jwt.verify(token, secret_key);
            req.user = decoded;
            next();
        }
        catch (err) {
            throw err;
        }
    }
});

exports.unauthenticated = ((req, res, next) => {
    const token = req.cookies['token'];
    if (token === undefined) {
        next();
    }
    else {
        res.redirect('/');
    }
});