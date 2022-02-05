require('dotenv').config();
const mysql = require('mysql2/promise');

module.exports = mysql.createConnection({
    host: process.env.DB_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});