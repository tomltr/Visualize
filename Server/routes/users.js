const express = require('express');
const router = express.Router();
const authenticated = require('../util/authentication').authenticated;
const unauthenticated = require('../util/authentication').unauthenticated;
const users_controller = require('../controllers/users');

router.get('/register', unauthenticated, users_controller.get_register_user);
router.post('/register', users_controller.post_register_user);
router.get('/login', unauthenticated, users_controller.get_login);
router.post('/login', users_controller.post_login);
router.get('/logout', authenticated, users_controller.get_logout);

module.exports = router;