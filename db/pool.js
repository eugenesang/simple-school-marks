const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school-marks',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool instance for reuse
module.exports = pool;
