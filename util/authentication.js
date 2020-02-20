const jwt = require('jsonwebtoken');
const secret_key = require('../config');

exports.authenticated = ((req, res, next) => {
    const token = req.body.token;
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
    const token = req.body.token;
    //console.log(`token: ${token}`);
    if (token === undefined) {
        next();
    }
    else {
        res.redirect('/');
    }
});
