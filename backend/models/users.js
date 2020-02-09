const db = require('../util/database');

module.exports = class User {
    constructor(full_name, username, email, password, address, phone_number) {
        this.full_name = full_name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone_number = phone_number;
    }

    add_user() {
        return db.query('INSERT INTO users ( full_name, username, email, password, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6)', [this.full_name, this.username, this.email, this.password, this.address, this.phone_number]);
    }

    static get_user(username) {
        return db.query('SELECT * FROM users WHERE users.username=$1', [username]);
    }

}