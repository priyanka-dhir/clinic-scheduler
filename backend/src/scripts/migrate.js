const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'clinic_user',
    password: process.env.DB_PASSWORD || 'userpassword',
    database: process.env.DB_NAME || 'clinic_db',
    multipleStatements: true,
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');

    await connection.query(schemaSql);
    await connection.query(seedSql);

    console.log('Database migrated and seeded successfully');
    await connection.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
