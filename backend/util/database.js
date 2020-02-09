// Creating a pool connection from postgresql
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres_user',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 'your port'
});

// Error message from pool
pool.on('error', (err) => {
    console.log(`error: ${err}`);
    process.exit(-1);
})

module.exports = pool;
