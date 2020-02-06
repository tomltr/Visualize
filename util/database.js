// Creating a pool connection from postgresql
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'database',
    password: 'password',
    port: port
});

// Error message from pool
pool.on('error', (err) => {
    console.log(`error: ${err}`);
    process.exit(-1);
})

module.exports = pool;
