const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA
  }
});

pool.getConnection()
  .then(() => console.log("Connected to Aiven MySQL successfully"))
  .catch(err => console.log("DB Connection Error:", err));

module.exports = pool;
