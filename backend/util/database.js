// Creating a pool connection from postgresql
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'visualize',
    password: 'viettom7',
    port: 5432
});

// Error message from pool
pool.on('error', (err) => {
    console.log(`error: ${err}`);
    process.exit(-1);
})

module.exports = pool;
